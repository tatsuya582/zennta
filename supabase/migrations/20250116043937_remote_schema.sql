alter table "public"."favoriteGroupRelations" add column "createdAt" timestamp with time zone not null default now();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_user_favorite_groups_and_articles(user_id uuid)
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
        FROM "favoriteGroups" fg
        WHERE fg."userId" = user_id
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_favorite_group(user_id uuid, group_title text, articles jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
  group_id UUID;
BEGIN
  IF (SELECT COUNT(*) FROM "favoriteGroups" WHERE "userId" = user_id) >= 10 THEN
    RAISE EXCEPTION 'You can only have up to 10 favorite groups.';
  END IF;
  
  INSERT INTO "favoriteGroups" (title, "userId")
  VALUES (group_title, user_id)
  RETURNING id INTO group_id;

  INSERT INTO "favoriteGroupRelations" ("groupId", "favoriteId", "createdAt")
  SELECT
    group_id,
    (article->>'favoriteId')::UUID,
    NOW() + (ROW_NUMBER() OVER ()) * INTERVAL '1 millisecond'
  FROM jsonb_array_elements(articles) WITH ORDINALITY AS article(article, ordinality);

  RETURN group_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.edit_favorite_group(user_id uuid, group_id uuid, group_title text, articles jsonb)
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
  SET title = group_title
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


