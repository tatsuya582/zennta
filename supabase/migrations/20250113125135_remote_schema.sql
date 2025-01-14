set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_favorite_group(user_id uuid, group_title text, articles jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$DECLARE
  group_id UUID;
BEGIN
  INSERT INTO "favoriteGroups" (title, "userId")
  VALUES (group_title, user_id)
  RETURNING id INTO group_id;

  INSERT INTO "favoriteGroupRelations" ("groupId", "favoriteId")
  SELECT
    group_id,
    (article->>'favoriteId')::UUID
  FROM jsonb_array_elements(articles) AS article;

  RETURN group_id;
END;$function$
;


