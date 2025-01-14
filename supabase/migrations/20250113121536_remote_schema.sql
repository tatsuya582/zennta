drop function if exists "public"."fetch_create_group__articles"(user_id uuid, page integer, page_size integer, query text);

drop function if exists "public"."get_articles_by_favorite_group"(group_id uuid);

create table "public"."favoriteGroupRelations" (
    "id" uuid not null default gen_random_uuid(),
    "favoriteId" uuid not null,
    "groupId" uuid not null
);


alter table "public"."favoriteGroupRelations" enable row level security;

alter table "public"."favoriteGroups" drop column "articles";

CREATE UNIQUE INDEX favorite_group_relations_favorite_id_group_id_key ON public."favoriteGroupRelations" USING btree ("favoriteId", "groupId");

CREATE UNIQUE INDEX favorite_group_relations_pkey ON public."favoriteGroupRelations" USING btree (id);

CREATE UNIQUE INDEX unique_favorite_group ON public."favoriteGroupRelations" USING btree ("favoriteId", "groupId");

alter table "public"."favoriteGroupRelations" add constraint "favorite_group_relations_pkey" PRIMARY KEY using index "favorite_group_relations_pkey";

alter table "public"."favoriteGroupRelations" add constraint "favorite_group_relations_favorite_id_fkey" FOREIGN KEY ("favoriteId") REFERENCES favorites(id) ON DELETE CASCADE not valid;

alter table "public"."favoriteGroupRelations" validate constraint "favorite_group_relations_favorite_id_fkey";

alter table "public"."favoriteGroupRelations" add constraint "favorite_group_relations_favorite_id_group_id_key" UNIQUE using index "favorite_group_relations_favorite_id_group_id_key";

alter table "public"."favoriteGroupRelations" add constraint "favorite_group_relations_group_id_fkey" FOREIGN KEY ("groupId") REFERENCES "favoriteGroups"(id) ON DELETE CASCADE not valid;

alter table "public"."favoriteGroupRelations" validate constraint "favorite_group_relations_group_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_articles_by_favorite_group(group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$DECLARE
  result JSONB;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', a.id,
      'column_id', f.id,
      'title', a.title,
      'url', a.url,
      'tags', a.tags,
      'custom_tags', f.tags,
      'memo', f.memo
    )
  )
  INTO result
  FROM
    "favoriteGroupRelations" fgr
  INNER JOIN
    favorites f ON fgr."favoriteId" = f.id
  INNER JOIN
    articles a ON f."articleId" = a.id
  WHERE
    fgr."groupId" = group_id;

  RETURN result;
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_create_group_articles(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$DECLARE
  result JSON;
BEGIN
  WITH filtered_favorites AS (
    SELECT f.id, f."createdAt", a.title
    FROM favorites f
    JOIN articles a ON f."articleId" = a.id
    WHERE f."userId" = user_id
    AND (
      query IS NULL OR query = '' OR (
        ARRAY_LENGTH(
          ARRAY(
            SELECT keyword
            FROM unnest(string_to_array(query, ' ')) AS keyword
            WHERE (
              a.title ILIKE '%' || keyword || '%' OR
              a.tags::text ILIKE '%' || keyword || '%' OR
              f.tags::text ILIKE '%' || keyword || '%' OR
              f.memo ILIKE '%' || keyword || '%'
            )
          ), 1
        ) = ARRAY_LENGTH(string_to_array(query, ' '), 1)
      )
    )
  ),
  counted_filtered_favorites AS (
    SELECT *
    FROM filtered_favorites
    ORDER BY filtered_favorites."createdAt" DESC
    LIMIT page_size OFFSET (page - 1) * page_size
  )
  SELECT json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'favoriteId', counted_filtered_favorites.id,
          'title', counted_filtered_favorites.title
        )
      )
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM filtered_favorites
    )
  ) INTO result
  FROM counted_filtered_favorites;
  RETURN result;
END;$function$
;

grant delete on table "public"."favoriteGroupRelations" to "anon";

grant insert on table "public"."favoriteGroupRelations" to "anon";

grant references on table "public"."favoriteGroupRelations" to "anon";

grant select on table "public"."favoriteGroupRelations" to "anon";

grant trigger on table "public"."favoriteGroupRelations" to "anon";

grant truncate on table "public"."favoriteGroupRelations" to "anon";

grant update on table "public"."favoriteGroupRelations" to "anon";

grant delete on table "public"."favoriteGroupRelations" to "authenticated";

grant insert on table "public"."favoriteGroupRelations" to "authenticated";

grant references on table "public"."favoriteGroupRelations" to "authenticated";

grant select on table "public"."favoriteGroupRelations" to "authenticated";

grant trigger on table "public"."favoriteGroupRelations" to "authenticated";

grant truncate on table "public"."favoriteGroupRelations" to "authenticated";

grant update on table "public"."favoriteGroupRelations" to "authenticated";

grant delete on table "public"."favoriteGroupRelations" to "service_role";

grant insert on table "public"."favoriteGroupRelations" to "service_role";

grant references on table "public"."favoriteGroupRelations" to "service_role";

grant select on table "public"."favoriteGroupRelations" to "service_role";

grant trigger on table "public"."favoriteGroupRelations" to "service_role";

grant truncate on table "public"."favoriteGroupRelations" to "service_role";

grant update on table "public"."favoriteGroupRelations" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."favoriteGroupRelations"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."favoriteGroupRelations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."favoriteGroupRelations"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."favoriteGroupRelations"
as permissive
for update
to authenticated
using (true)
with check (true);



