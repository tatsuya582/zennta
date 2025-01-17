set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_favorite_groups_and_articles(page integer DEFAULT 1, page_size integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$BEGIN
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
          WHERE "isPublished" = TRUE
          ORDER BY "updatedAt" DESC
          LIMIT page_size OFFSET (page - 1) * page_size
        ) AS fg
    );
END;$function$
;


