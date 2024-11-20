set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_read_later_with_article(userid uuid, articleprovider text, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
DECLARE
  article_id uuid;
BEGIN
  -- 1. articlesテーブルで既存のURLを検索
  SELECT id INTO article_id
  FROM articles
  WHERE url = articleUrl;

  -- 2. 該当する記事がない場合、新規作成
  IF article_id IS NULL THEN
    INSERT INTO articles (provider, url, title, "sourceCreatedAt", tags)
    VALUES (articleProvider, articleUrl, articleTitle, articleSourceCreatedAt, tags::jsonb)
    RETURNING id INTO article_id;
  END IF;

  -- 3. readLatersテーブルに挿入
  INSERT INTO "readLaters" ("userId", "articleId")
  VALUES (userId, article_id);

  -- 4. 作成または取得したarticle_idを返す
  RETURN article_id;
EXCEPTION
  WHEN OTHERS THEN
    -- エラーが発生した場合にログを記録
    RAISE WARNING 'Error occurred: %', SQLERRM;
    -- 必要に応じてエラーを再スロー
    RAISE;
END;
$function$
;


