create table "public"."readLaters" (
    "id" uuid not null default gen_random_uuid(),
    "userId" uuid not null,
    "articleId" uuid,
    "createdAt" timestamp with time zone not null default now()
);


alter table "public"."readLaters" enable row level security;

CREATE UNIQUE INDEX idx_read_laters_user_article ON public."readLaters" USING btree ("userId", "articleId");

CREATE UNIQUE INDEX "readLaters_pkey" ON public."readLaters" USING btree (id);

alter table "public"."readLaters" add constraint "readLaters_pkey" PRIMARY KEY using index "readLaters_pkey";

alter table "public"."readLaters" add constraint "readLaters_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES articles(id) not valid;

alter table "public"."readLaters" validate constraint "readLaters_articleId_fkey";

alter table "public"."readLaters" add constraint "readLaters_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) not valid;

alter table "public"."readLaters" validate constraint "readLaters_userId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_read_later_with_article(userid uuid, articleprovider text, articleurl text, articletitle text, articlesourcecreatedat timestamp with time zone DEFAULT NULL::timestamp with time zone, tags json DEFAULT NULL::json)
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

  INSERT INTO "readLaters" ("userId", "articleId")
  VALUES (userId, article_id);
EXCEPTION
  WHEN OTHERS THEN
    -- エラーが発生した場合にログを記録
    RAISE WARNING 'Error occurred: %', SQLERRM;
    -- 必要に応じてエラーを再スロー
    RAISE;
END;$function$
;

grant delete on table "public"."readLaters" to "anon";

grant insert on table "public"."readLaters" to "anon";

grant references on table "public"."readLaters" to "anon";

grant select on table "public"."readLaters" to "anon";

grant trigger on table "public"."readLaters" to "anon";

grant truncate on table "public"."readLaters" to "anon";

grant update on table "public"."readLaters" to "anon";

grant delete on table "public"."readLaters" to "authenticated";

grant insert on table "public"."readLaters" to "authenticated";

grant references on table "public"."readLaters" to "authenticated";

grant select on table "public"."readLaters" to "authenticated";

grant trigger on table "public"."readLaters" to "authenticated";

grant truncate on table "public"."readLaters" to "authenticated";

grant update on table "public"."readLaters" to "authenticated";

grant delete on table "public"."readLaters" to "service_role";

grant insert on table "public"."readLaters" to "service_role";

grant references on table "public"."readLaters" to "service_role";

grant select on table "public"."readLaters" to "service_role";

grant trigger on table "public"."readLaters" to "service_role";

grant truncate on table "public"."readLaters" to "service_role";

grant update on table "public"."readLaters" to "service_role";

create policy "Enable users to delete their own data only"
on "public"."readLaters"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to insert their own data only"
on "public"."readLaters"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable users to view their own data only"
on "public"."readLaters"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));



