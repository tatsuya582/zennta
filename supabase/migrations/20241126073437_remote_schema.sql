drop function if exists "public"."insert_history_with_article"(userid uuid, articleprovider text, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone, tags json);

drop function if exists "public"."insert_read_later_with_article"(userid uuid, articleprovider text, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone, tags json);

alter table "public"."articles" drop column "provider";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_or_update_history(user_id uuid, article_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF EXISTS (
    SELECT 1 FROM histories
    WHERE "userId" = user_id AND "articleId" = article_id
  ) THEN
    -- 既存の履歴を更新
    UPDATE histories
    SET "updatedAt" = NOW()
    WHERE "userId" = user_id AND "articleId" = article_id;
  ELSE
    -- 新しい履歴を挿入
    INSERT INTO histories ("userId", "articleId", "updatedAt")
    VALUES (user_id, article_id, NOW());
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- エラーが発生した場合にログを記録
    RAISE WARNING 'Error occurred: %', SQLERRM;
    -- 必要に応じてエラーを再スロー
    RAISE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_history_with_article(userid uuid, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
 RETURNS void
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
    INSERT INTO articles (url, title, "sourceCreatedAt", tags)
    VALUES (articleUrl, articleTitle, articleSourceCreatedAt, tags::jsonb)
    RETURNING id INTO article_id;
  END IF;

  -- 3. historiesテーブルで既存の履歴を確認
  IF EXISTS (
    SELECT 1
    FROM histories
    WHERE userId = userId AND articleId = article_id
  ) THEN
    -- 履歴が存在する場合は updatedAt を更新
    UPDATE histories
    SET "updatedAt" = NOW()
    WHERE "userId" = userId AND "articleId" = article_id;
  ELSE
    -- 履歴が存在しない場合は新しい履歴を挿入
    INSERT INTO histories ("userId", "articleId", "updatedAt")
    VALUES (userId, article_id, NOW());
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- エラーが発生した場合にログを記録
    RAISE WARNING 'Error occurred: %', SQLERRM;
    -- 必要に応じてエラーを再スロー
    RAISE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.insert_read_later_with_article(userid uuid, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
 RETURNS void
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
    INSERT INTO articles (url, title, "sourceCreatedAt", tags)
    VALUES (articleUrl, articleTitle, articleSourceCreatedAt, tags::jsonb)
    RETURNING id INTO article_id;
  END IF;

  -- 3. readLatersテーブルに挿入
  INSERT INTO "readLaters" ("userId", "articleId")
  VALUES (userId, article_id);
EXCEPTION
  WHEN OTHERS THEN
    -- エラーが発生した場合にログを記録
    RAISE WARNING 'Error occurred: %', SQLERRM;
    -- 必要に応じてエラーを再スロー
    RAISE;
END;
$function$
;


