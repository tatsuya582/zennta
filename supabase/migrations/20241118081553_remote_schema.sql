create table "public"."articles" (
    "provider" text not null,
    "sourceCreatedAt" timestamp with time zone not null,
    "url" text not null,
    "title" text not null,
    "id" uuid not null default gen_random_uuid(),
    "tags" jsonb
);


alter table "public"."articles" enable row level security;

create table "public"."histories" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "articleId" uuid not null,
    "updatedAt" timestamp with time zone not null default now()
);


alter table "public"."histories" enable row level security;

CREATE UNIQUE INDEX articles_id_key ON public.articles USING btree (id);

CREATE UNIQUE INDEX articles_pkey ON public.articles USING btree (id);

CREATE UNIQUE INDEX histories_pkey ON public.histories USING btree (id);

CREATE UNIQUE INDEX idx_histories_user_article ON public.histories USING btree ("userId", "articleId");

alter table "public"."articles" add constraint "articles_pkey" PRIMARY KEY using index "articles_pkey";

alter table "public"."histories" add constraint "histories_pkey" PRIMARY KEY using index "histories_pkey";

alter table "public"."articles" add constraint "articles_id_key" UNIQUE using index "articles_id_key";

alter table "public"."histories" add constraint "histories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES articles(id) not valid;

alter table "public"."histories" validate constraint "histories_articleId_fkey";

alter table "public"."histories" add constraint "histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) not valid;

alter table "public"."histories" validate constraint "histories_userId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_history_with_article(userid uuid, articleprovider text, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
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
    INSERT INTO articles (provider, url, title, "sourceCreatedAt", tags)
    VALUES (articleProvider, articleUrl, articleTitle, articleSourceCreatedAt, tags::jsonb)
    RETURNING id INTO article_id;
  END IF;

  -- 3. historiesテーブルで既存の履歴を確認
  IF EXISTS (
    SELECT 1
    FROM histories
    WHERE "userId" = userId AND "articleId" = article_id
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

grant delete on table "public"."articles" to "anon";

grant insert on table "public"."articles" to "anon";

grant references on table "public"."articles" to "anon";

grant select on table "public"."articles" to "anon";

grant trigger on table "public"."articles" to "anon";

grant truncate on table "public"."articles" to "anon";

grant update on table "public"."articles" to "anon";

grant delete on table "public"."articles" to "authenticated";

grant insert on table "public"."articles" to "authenticated";

grant references on table "public"."articles" to "authenticated";

grant select on table "public"."articles" to "authenticated";

grant trigger on table "public"."articles" to "authenticated";

grant truncate on table "public"."articles" to "authenticated";

grant update on table "public"."articles" to "authenticated";

grant delete on table "public"."articles" to "service_role";

grant insert on table "public"."articles" to "service_role";

grant references on table "public"."articles" to "service_role";

grant select on table "public"."articles" to "service_role";

grant trigger on table "public"."articles" to "service_role";

grant truncate on table "public"."articles" to "service_role";

grant update on table "public"."articles" to "service_role";

grant delete on table "public"."histories" to "anon";

grant insert on table "public"."histories" to "anon";

grant references on table "public"."histories" to "anon";

grant select on table "public"."histories" to "anon";

grant trigger on table "public"."histories" to "anon";

grant truncate on table "public"."histories" to "anon";

grant update on table "public"."histories" to "anon";

grant delete on table "public"."histories" to "authenticated";

grant insert on table "public"."histories" to "authenticated";

grant references on table "public"."histories" to "authenticated";

grant select on table "public"."histories" to "authenticated";

grant trigger on table "public"."histories" to "authenticated";

grant truncate on table "public"."histories" to "authenticated";

grant update on table "public"."histories" to "authenticated";

grant delete on table "public"."histories" to "service_role";

grant insert on table "public"."histories" to "service_role";

grant references on table "public"."histories" to "service_role";

grant select on table "public"."histories" to "service_role";

grant trigger on table "public"."histories" to "service_role";

grant truncate on table "public"."histories" to "service_role";

grant update on table "public"."histories" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."articles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."articles"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."histories"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable insert for users based on user_id"
on "public"."histories"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable update for users based on user_id"
on "public"."histories"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = "userId"))
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to view their own data only"
on "public"."histories"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));



