set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_favorites_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'id', a.id,
          'column_id', paginated_favorites.id,
          'title', a.title,
          'url', a.url,
          'tags', a.tags,
          'custom_tags', paginated_favorites.tags,
          'memo', paginated_favorites.memo,
          'is_in_other_table', COALESCE(rl."userId" IS NOT NULL, FALSE)
        )
        ORDER BY paginated_favorites."createdAt" DESC
      )
      FROM (
        SELECT f.id, f."articleId", f."createdAt", f.tags, f.memo
        FROM favorites f
        WHERE f."userId" = user_id
        ORDER BY f."createdAt" DESC
        LIMIT page_size OFFSET (page - 1) * page_size
      ) paginated_favorites
      JOIN articles a ON paginated_favorites."articleId" = a.id
      LEFT JOIN "readLaters" rl ON rl."articleId" = a.id AND rl."userId" = user_id
      WHERE (
        query IS NULL OR
        a.title ILIKE '%' || query || '%' OR
        a.tags::text ILIKE '%' || query || '%' OR
        paginated_favorites.tags::text ILIKE '%' || query || '%' OR
        paginated_favorites.memo ILIKE '%' || query || '%'
      )
    ),
    'total_count', (
      SELECT COUNT(*)
      FROM favorites f
      JOIN articles a ON f."articleId" = a.id
      WHERE f."userId" = user_id
      AND (
        query IS NULL OR
        a.title ILIKE '%' || query || '%' OR
        a.tags::text ILIKE '%' || query || '%' OR
        f.tags::text ILIKE '%' || query || '%' OR
        f.memo ILIKE '%' || query || '%'
      )
    )
  );
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_read_laters_articles_with_count(user_id uuid, page integer DEFAULT 1, page_size integer DEFAULT 30, query text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN json_build_object(
    'articles', (
      SELECT json_agg(
        json_build_object(
          'id', a.id,
          'column_id', paginated_readlaters.id,
          'title', a.title,
          'url', a.url,
          'tags', a.tags,
          'is_in_other_table', COALESCE(f."userId" IS NOT NULL, FALSE)
        )
        ORDER BY paginated_readlaters."createdAt" DESC
      )
      FROM (
        SELECT rl.id ,rl."articleId", rl."createdAt"
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
END;$function$
;


