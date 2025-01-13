set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_create_group__articles(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
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


