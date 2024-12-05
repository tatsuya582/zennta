set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_favorites_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$DECLARE
  result JSON;
BEGIN
  WITH filtered_favorites AS (
    SELECT f.id, f."articleId", f."createdAt", f.tags, f.memo, a.id AS article_id, a.title, a.url, a.tags AS article_tags
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
  ORDER BY f."createdAt" DESC
  )
  SELECT json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'id', filtered_favorites.article_id,
          'column_id', filtered_favorites.id,
          'title', filtered_favorites.title,
          'url', filtered_favorites.url,
          'tags', filtered_favorites.article_tags,
          'custom_tags', filtered_favorites.tags,
          'memo', filtered_favorites.memo,
          'is_in_other_table', COALESCE(rl."userId" IS NOT NULL, FALSE)
        )
        ORDER BY filtered_favorites."createdAt" DESC
      )
      FROM filtered_favorites
      LEFT JOIN "readLaters" rl ON rl."articleId" = filtered_favorites.article_id AND rl."userId" = user_id
      LIMIT page_size OFFSET (page - 1) * page_size
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM filtered_favorites
    )
  ) INTO result;

  RETURN result;
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_read_laters_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$DECLARE
  result JSON;
BEGIN
  WITH filtered_read_laters AS (
    SELECT rl.id, rl."articleId", rl."createdAt", a.id AS article_id, a.title, a.url, a.tags
    FROM "readLaters" rl
    JOIN articles a ON rl."articleId" = a.id
    WHERE rl."userId" = user_id
    AND (
  query IS NULL OR query = '' OR (
    ARRAY_LENGTH(
      ARRAY(
        SELECT keyword
        FROM unnest(string_to_array(query, ' ')) AS keyword
        WHERE (
          a.title ILIKE '%' || keyword || '%' OR
          a.tags::text ILIKE '%' || keyword || '%'
        )
      ), 1
    ) = ARRAY_LENGTH(string_to_array(query, ' '), 1)
  )
)
  ORDER BY rl."createdAt" DESC
  )
  SELECT json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'id', filtered_read_laters.article_id,
          'column_id', filtered_read_laters.id,
          'other_column_id', f.id,
          'title', filtered_read_laters.title,
          'url', filtered_read_laters.url,
          'tags', filtered_read_laters.tags,
          'is_in_other_table', COALESCE(f."userId" IS NOT NULL, FALSE)
        )
        ORDER BY filtered_read_laters."createdAt" DESC
      )
      FROM filtered_read_laters
      LEFT JOIN favorites f ON f."articleId" = filtered_read_laters.article_id AND f."userId" = user_id
      LIMIT page_size OFFSET (page - 1) * page_size
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM filtered_read_laters
    )
  ) INTO result;

  RETURN result;
END;$function$
;


