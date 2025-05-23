import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import metascraper from "metascraper";
import metascraperTitle from "metascraper-title";
import { type FetchedArticle, type FetchedArticlesWithCount } from "@/types/databaseCustom.types";
import { type FetchedItem, type StoredItem } from "@/types/types";

export const addArticle = async (
  tableName: "favorites" | "readLaters" | "histories",
  item: FetchedItem | StoredItem,
  rpcName?: "insert_favorite_with_article" | "insert_read_later_with_article" | "insert_history_with_article"
) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    if (rpcName && "created_at" in item) {
      const { data, error } = await supabase.rpc(rpcName, {
        userid: user.id,
        articleurl: item.url,
        articletitle: item.title,
        articlesourcecreatedat: item.created_at,
        tags: item.tags,
      });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from(tableName)
        .insert({ userId: user.id, articleId: item.id })
        .select("id");

      if (error) {
        throw new Error(error.message);
      }
      return data[0].id;
    }
  } catch (err) {
    console.error(`Error adding article to ${tableName}:`, err);
    throw err;
  }
};

export const deleteArticle = async (tableName: "favorites" | "readLaters", tableId: string) => {
  try {
    const { supabase } = await getSupabaseClientAndUser();

    const { error } = await supabase.from(tableName).delete().eq("id", tableId);

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
  query: string | undefined
) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const normalizeQuery = query ? query.replace(/　/g, " ").replace(/\s+/g, " ").trim() : "";

    const { data } = (await supabase.rpc(rpcName, {
      user_id: user.id,
      page: page,
      query: normalizeQuery,
    })) as unknown as { data: FetchedArticlesWithCount };

    const totalPage = data?.total_count ? Math.ceil(data.total_count / 30) : 1;

    return { articles: data?.articles, totalPage };
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

    if (!user) {
      return new Map();
    }

    const start = items[items.length - 1].created_at;
    const end = items[0].created_at;

    const { data } = (await supabase
      .from(tableName)
      .select(
        `
        id,
        articles:articleId (id, sourceCreatedAt, url)
      `
      )
      .eq("userId", user.id)
      .gte("articles.sourceCreatedAt", start)
      .lte("articles.sourceCreatedAt", end)
      .not("articles", "is", null)) as unknown as { data: FetchedArticle[] };

    if (!data) {
      return new Map();
    }

    const articlesMap = new Map(data.map((item) => [item.articles?.url, item.id]));
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

    if (!user) {
      return new Map();
    }

    const { data } = (await supabase
      .from(tableName)
      .select(
        `
        id,
        articles:articleId (id, url)
      `
      )
      .eq("userId", user.id)
      .not("articles", "is", null)) as unknown as { data: FetchedArticle[] };

    if (!data) {
      return new Map();
    }

    const articlesMap = new Map(data.map((item) => [item.articles?.url, item.id]));
    return articlesMap;
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const addArticleByUrl = async (
  url: string,
  rpcName: "insert_favorite_with_article" | "insert_read_later_with_article"
) => {
  const scraper = metascraper([metascraperTitle()]);
  let title: string | undefined;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const metadata = await scraper({ html, url });
    title = metadata.title;
  } catch (error) {
    return "サイトがありません";
  }

  if (!title) {
    return "サイトがありません";
  }

  const { supabase, user } = await getSupabaseClientAndUser();

  if (!user) {
    return;
  }

  try {
    const { error } = await supabase.rpc(rpcName, {
      userid: user.id,
      articleurl: url,
      articletitle: title,
      articlesourcecreatedat: new Date().toISOString(),
      tags: null,
    });

    if (error) {
      if (error.message.includes("duplicate key value violates unique constraint")) {
        return "登録済みです";
      }
      throw new Error(error.message);
    }
    return "登録しました";
  } catch (error) {
    throw error;
  }
};
