import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { FetchedArticle, FetchedArticlesWithCount } from "@/types/databaseCustom.types";
import { FetchedItem, StoredItem } from "@/types/types";

export const addArticle = async (
  tableName: "favorites" | "readLaters" | "histories",
  item: FetchedItem | StoredItem,
  rpcName?: "insert_favorite_with_article" | "insert_read_later_with_article" | "insert_history_with_article"
) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (rpcName && "created_at" in item) {
      const { error } = await supabase.rpc(rpcName, {
        userid: user.id,
        articleurl: item.url,
        articletitle: item.title,
        articlesourcecreatedat: item.created_at,
        tags: item.tags,
      });

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from(tableName).insert({ userId: user.id, articleId: item.id });

      if (error) {
        throw error;
      }
    }
  } catch (err) {
    console.error(`Error adding article to ${tableName}:`, err);
    throw err;
  }
};

export const deleteArticle = async (tableName: "favorites" | "readLaters", articleId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { error } = await supabase.from(tableName).delete().eq("userId", user.id).eq("articleId", articleId);

    if (error) {
      throw new Error(`Failed to delete record from ${tableName}: ${error.message}`);
    }
  } catch (err) {
    console.error(`Error deleting article from ${tableName}:`, err);
    throw err;
  }
};

export const getArticles = async (
  rpcName: "fetch_favorites_articles_with_count" | "fetch_read_laters_articles_with_count",
  page: number,
  query: string | null
) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { data } = (await supabase.rpc(rpcName, {
      user_id: user.id,
      page: page,
      query: query,
    })) as unknown as { data: FetchedArticlesWithCount };

    const totalPage = data?.total_count !== null ? Math.ceil(data.total_count / 30) : 1;

    return { articles: data.articles, totalPage };
  } catch (err) {
    console.error(`Error fetching articles:`, err);
    throw err;
  }
};

export const getArticle = async (
  tableName: "favorites" | "readLaters",
  items: FetchedItem[]
): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const start = items[items.length - 1].created_at;
    const end = items[0].created_at;

    const { data } = (await supabase
      .from(tableName)
      .select(`articles:articleId (id, sourceCreatedAt, url)`)
      .eq("userId", user.id)
      .gte("articles.sourceCreatedAt", start)
      .lte("articles.sourceCreatedAt", end)
      .not("articles", "is", null)) as unknown as { data: FetchedArticle[] };

    if (!data) {
      return new Map();
    }

    const articlesMap = new Map(data.map((item) => [item.articles?.url, item.articles?.id]));
    return articlesMap;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const getArticleHistory = async (
  tableName: "favorites" | "readLaters"
): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { data } = (await supabase
      .from(tableName)
      .select(`articles:articleId (id, url)`)
      .eq("userId", user.id)
      .not("articles", "is", null)) as unknown as { data: FetchedArticle[] };

    if (!data) {
      return new Map();
    }

    const articlesMap = new Map(data.map((item) => [item.articles?.url, item.articles?.id]));
    return articlesMap;
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};
