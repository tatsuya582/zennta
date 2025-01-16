set check_function_bodies = off;

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
  
  INSERT INTO "favoriteGroupRelations" ("groupId", "favoriteId")
  SELECT
    group_id,
    (article->>'favoriteId')::UUID
  FROM jsonb_array_elements(articles) AS article;

  RETURN group_id;
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_edit_group(group_id uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(
    json_build_object(
      'favoriteId', f.id,
      'title', a.title
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
END;
$function$
;


