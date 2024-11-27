"use server";

import { addArticle, deleteArticle, getArticle, getArticleHistory, getArticles } from "@/actions/storedArticle";
import { type StoredItem, type FetchedItem } from "@/types/types";

export const addFavorite = async (item: FetchedItem) => {
  addArticle("favorites", item, "insert_favorite_with_article");
};

export const addStoredFavorite = async (item: StoredItem) => {
  addArticle("favorites", item)
};

export const getFavorite = async (start: string, end: string): Promise<Map<string | undefined, string | undefined>> => {
  return getArticle("favorites", start, end);
};

export const getFavoriteHistory = async (): Promise<Map<string | undefined, string | undefined>> => {
  return getArticleHistory("favorites");
};

export const deleteFavorite = async (articleId: string) => {
  deleteArticle("favorites", articleId);
};

export const getFavoriteArticles = async (page: number) => {
  return getArticles("favorites", page);
};
