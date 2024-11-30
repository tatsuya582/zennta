"use server";

import { addArticle, deleteArticle, getArticle, getArticleHistory, getArticles } from "@/actions/storedArticle";
import { type StoredItem, type FetchedItem } from "@/types/types";

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

export const getFavoriteArticles = async (page: number, query: string | null) => {
  return getArticles("fetch_favorites_articles_with_count", page, query);
};
