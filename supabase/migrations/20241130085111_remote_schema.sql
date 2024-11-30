drop function if exists "public"."fetch_read_laters_articles_with_count"(user_id uuid, page integer, page_size integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_read_laters_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'id', a.id,
          'title', a.title,
          'url', a.url,
          'tags', a.tags,
          'is_in_other_table', COALESCE(f."userId" IS NOT NULL, FALSE)
        )
        ORDER BY paginated_readlaters."createdAt" DESC
      )
      FROM (
        SELECT rl."articleId", rl."createdAt"
        FROM "readLaters" rl
        WHERE rl."userId" = user_id
        ORDER BY rl."createdAt" DESC
        LIMIT page_size OFFSET (page - 1) * page_size
      ) paginated_readlaters
      JOIN articles a ON paginated_readlaters."articleId" = a.id
      LEFT JOIN favorites f ON f."articleId" = a.id AND f."userId" = user_id
      WHERE (
        query IS NULL OR
        a.title ILIKE '%' || query || '%' OR
        a.tags::text ILIKE '%' || query || '%'
      )
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM "readLaters" rl
      JOIN articles a ON rl."articleId" = a.id
      WHERE rl."userId" = user_id
      AND (
        query IS NULL OR
        a.title ILIKE '%' || query || '%' OR
        a.tags::text ILIKE '%' || query || '%'
      )
    )
  );
END;
$function$
;


