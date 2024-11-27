create table "public"."favorites" (
    "id" uuid not null default gen_random_uuid(),
    "createdAt" timestamp with time zone not null default now(),
    "userId" uuid not null,
    "articleId" uuid not null
);


alter table "public"."favorites" enable row level security;

CREATE UNIQUE INDEX favorites_pkey ON public.favorites USING btree (id);

CREATE UNIQUE INDEX "favorites_userId_articleId_idx" ON public.favorites USING btree ("userId", "articleId");

CREATE INDEX "favorites_userId_createdAt_idx" ON public.favorites USING btree ("userId", "createdAt" DESC);

CREATE INDEX "favorites_userId_idx" ON public.favorites USING btree ("userId");

alter table "public"."favorites" add constraint "favorites_pkey" PRIMARY KEY using index "favorites_pkey";

alter table "public"."favorites" add constraint "favorites_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES articles(id) not valid;

alter table "public"."favorites" validate constraint "favorites_articleId_fkey";

alter table "public"."favorites" add constraint "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."favorites" validate constraint "favorites_userId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_favorite_with_article(userid uuid, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
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

  -- 3. favoritesテーブルに挿入
  INSERT INTO favorites ("userId", "articleId")
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

CREATE OR REPLACE FUNCTION public.insert_history_with_article(userid uuid, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$DECLARE
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
    WHERE userId = userId AND "articleId" = article_id
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
END;$function$
;

grant delete on table "public"."favorites" to "anon";

grant insert on table "public"."favorites" to "anon";

grant references on table "public"."favorites" to "anon";

grant select on table "public"."favorites" to "anon";

grant trigger on table "public"."favorites" to "anon";

grant truncate on table "public"."favorites" to "anon";

grant update on table "public"."favorites" to "anon";

grant delete on table "public"."favorites" to "authenticated";

grant insert on table "public"."favorites" to "authenticated";

grant references on table "public"."favorites" to "authenticated";

grant select on table "public"."favorites" to "authenticated";

grant trigger on table "public"."favorites" to "authenticated";

grant truncate on table "public"."favorites" to "authenticated";

grant update on table "public"."favorites" to "authenticated";

grant delete on table "public"."favorites" to "service_role";

grant insert on table "public"."favorites" to "service_role";

grant references on table "public"."favorites" to "service_role";

grant select on table "public"."favorites" to "service_role";

grant trigger on table "public"."favorites" to "service_role";

grant truncate on table "public"."favorites" to "service_role";

grant update on table "public"."favorites" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."favorites"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable insert for users based on user_id"
on "public"."favorites"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable update for users based on user_id"
on "public"."favorites"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"))
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to view their own data only"
on "public"."favorites"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));



