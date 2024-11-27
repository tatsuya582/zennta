"use server";

import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { type FetchedArticle, type FetchedArticles } from "@/types/databaseCustom.types";
import { type StoredItem, type FetchedItem } from "@/types/types";

export const addFavorite = async (item: FetchedItem) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { data, error } = await supabase.rpc("insert_favorite_with_article", {
      userid: user.id,
      articleurl: item.url,
      articletitle: item.title,
      articlesourcecreatedat: item.created_at,
      tags: item.tags,
    });

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const addStoredFavorite = async (item: StoredItem) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { error } = await supabase.from("favorites").insert({ userId: user.id, articleId: item.id });

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const getFavorite = async (start: string, end: string): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { data } = (await supabase
      .from("favorites")
      .select(`articles:articleId (id, sourceCreatedAt, url)`)
      .eq("userId", user.id)
      .gte("articles.sourceCreatedAt", start)
      .lte("articles.sourceCreatedAt", end)
      .not("articles", "is", null)) as unknown as { data: FetchedArticle[] };

    if (!data) {
      return new Map();
    }

    const favoriteMap = new Map(data.map((item) => [item.articles?.url, item.articles?.id]));
    return favoriteMap;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const getFavoriteHistory = async (): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { data } = (await supabase
      .from("favorites")
      .select(`articles:articleId (id, url)`)
      .eq("userId", user.id)
      .not("articles", "is", null)) as unknown as { data: FetchedArticle[] };

    if (!data) {
      return new Map();
    }

    const favoriteMap = new Map(data.map((item) => [item.articles?.url, item.articles?.id]));
    return favoriteMap;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const deleteFavorite = async (articleId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { error } = await supabase.from("favorites").delete().eq("userId", user.id).eq("articleId", articleId);

    if (error) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }
  } catch (error) {
    console.error("Error deleting favorite entry:", error);
  }
};

export const getFavoriteArticles = async (page: number) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();
    const start = 30 * (page - 1);
    const end = 30 * page - 1;

    const { data, count } = (await supabase
      .from("favorites")
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
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
