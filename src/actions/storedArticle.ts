import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { FetchedArticle, FetchedArticles } from "@/types/databaseCustom.types";
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

export const getArticles = async (tableName: "favorites" | "readLaters", page: number) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const start = 30 * (page - 1);
    const end = 30 * page - 1;

    const { data, count } = (await supabase
      .from(tableName)
      .select(
        `
        articles:articleId (id, title, url, tags)
        `,
        { count: "exact" }
      )
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .range(start, end)) as unknown as { data: FetchedArticles[]; count: number | null };

    const totalPage = count !== null ? Math.ceil(count / 30) : 1;

    return { articles: data, totalPage };
  } catch (err) {
    console.error(`Error fetching articles from ${tableName}:`, err);
    throw err;
  }
};

export const getArticle = async (
  tableName: "favorites" | "readLaters",
  start: string,
  end: string,
): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

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
