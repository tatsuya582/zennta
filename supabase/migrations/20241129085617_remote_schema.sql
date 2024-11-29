set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_favorites_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30)
 RETURNS json
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'article_id', a.id,
          'title', a.title,
          'url', a.url,
          'tags', a.tags,
          'is_in_other_table', COALESCE(rl."userId" IS NOT NULL, FALSE)
        )
      )
      FROM (
        SELECT f."articleId", f."createdAt"
        FROM favorites f
        WHERE f."userId" = user_id
        ORDER BY f."createdAt" DESC
        LIMIT page_size OFFSET (page - 1) * page_size
      ) paginated_favorites
      JOIN articles a ON paginated_favorites."articleId" = a.id
      LEFT JOIN "readLaters" rl ON rl."articleId" = a.id AND rl."userId" = user_id
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM favorites f
      WHERE f."userId" = user_id
    )
  );
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_read_laters_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'article_id', a.id,
          'title', a.title,
          'url', a.url,
          'tags', a.tags,
          'is_in_other_table', COALESCE(f."userId" IS NOT NULL, FALSE)
        )
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
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM "readLaters" rl
      WHERE rl."userId" = user_id
    )
  );
END;
$function$
;


