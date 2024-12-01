"use server";

import { addArticle, deleteArticle, getArticle, getArticleHistory, getArticles } from "@/actions/storedArticle";
import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { type StoredItem, type FetchedItem, Tag } from "@/types/types";

export const addFavorite = async (item: FetchedItem) => {
  addArticle("favorites", item, "insert_favorite_with_article");
};

export const addStoredFavorite = async (item: StoredItem) => {
  addArticle("favorites", item);
};

export const getFavorite = async (items: FetchedItem[]): Promise<Map<string | undefined, string | undefined>> => {
  return getArticle("favorites", items);
};

export const getFavoriteHistory = async (): Promise<Map<string | undefined, string | undefined>> => {
  return getArticleHistory("favorites");
};

export const deleteFavorite = async (articleId: string) => {
  deleteArticle("favorites", articleId);
};

export const getFavoriteArticles = async (page: number, query: string | undefined) => {
  return getArticles("fetch_favorites_articles_with_count", page, query);
};

export const updateFavoriteColumn = async (id: string, value: string | Tag[]) => {
  try {
    const { supabase } = await getSupabaseClientAndUser();
    const column = typeof value === "string" ? "memo" : "tags";

    const { error } = await supabase
      .from("favorites")
      .update({ [column]: value })
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
