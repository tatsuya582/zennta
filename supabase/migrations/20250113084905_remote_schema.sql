set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_articles_by_favorite_group(group_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
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
    favorites f
  INNER JOIN
    articles a ON f."articleId" = a.id
  WHERE
    f.id IN (
      SELECT (jsonb_array_elements("articles")->>'favoriteId')::UUID
      FROM "favoriteGroups"
      WHERE "favoriteGroups".id = group_id
    );

  RETURN result;
END;
$function$
;


