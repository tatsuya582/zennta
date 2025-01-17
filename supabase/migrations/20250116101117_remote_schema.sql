drop function if exists "public"."edit_favorite_group"(user_id uuid, group_id uuid, group_title text, articles jsonb);

alter table "public"."favoriteGroups" alter column "userName" set default '匿名'::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.edit_favorite_group(user_id uuid, user_name text, group_id uuid, group_title text, ispublished boolean, articles jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "favoriteGroups"
    WHERE id = group_id AND "userId" = user_id
  ) THEN
    RAISE EXCEPTION 'Group does not belong to the user';
  END IF;

  UPDATE "favoriteGroups"
  SET 
    title = group_title,
    "userName" = user_name,
    "isPublished" = ispublished
  WHERE id = group_id;

  DELETE FROM "favoriteGroupRelations"
  WHERE "groupId" = group_id;
  
  INSERT INTO "favoriteGroupRelations" ("groupId", "favoriteId", "createdAt")
  SELECT
    group_id,
    (article->>'favoriteId')::UUID,
    NOW() + (ROW_NUMBER() OVER ()) * INTERVAL '1 millisecond'
  FROM jsonb_array_elements(articles) WITH ORDINALITY AS article(article, ordinality);

  RETURN group_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_favorite_groups_and_articles(page integer DEFAULT 1, page_size integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', fg.id,
                'title', fg.title,
                'userName', fg."userName",
                'isPublished', fg."isPublished",
                'userId', fg."userId",
                'createdAt', fg."createdAt",
                'updatedAt', fg."updatedAt",
                'articles', (
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'id', a.id,
                            'url', a.url,
                            'title', a.title,
                            'tags', a.tags
                        )
                    )
                    FROM (
                        SELECT fgr."favoriteId"
                        FROM "favoriteGroupRelations" fgr
                        WHERE fgr."groupId" = fg.id
                        ORDER BY fgr."createdAt" ASC
                        LIMIT 3
                    ) fgr
                    JOIN favorites f ON f.id = fgr."favoriteId"
                    JOIN articles a ON a.id = f."articleId"
                )
            )
        )
        FROM (
          SELECT *
          FROM "favoriteGroups"
          WHERE fg."isPublished" = TRUE
          ORDER BY "updatedAt" DESC
          LIMIT page_size OFFSET (page - 1) * page_size
        ) fg
    );
END;
$function$
;


