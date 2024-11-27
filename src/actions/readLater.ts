"use server";

import { addArticle, deleteArticle, getArticle, getArticleHistory, getArticles } from "@/actions/storedArticle";
import { StoredItem, type FetchedItem } from "@/types/types";

export const addreadLater = async (item: FetchedItem) => {
  addArticle("readLaters", item, "insert_read_later_with_article");
};

export const addStoredreadLater = async (item: StoredItem) => {
  addArticle("readLaters", item);
};

export const getReadLater = async (
  start: string,
  end: string
): Promise<Map<string | undefined, string | undefined>> => {
  return getArticle("readLaters", start, end);
};

export const getReadLaterHistory = async (): Promise<Map<string | undefined, string | undefined>> => {
  return getArticleHistory("readLaters")
};

export const deleteReadLater = async (articleId: string) => {
  deleteArticle("readLaters", articleId);
};

export const getReadLaterArticles = async (page: number) => {
  return getArticles("readLaters", page);
};
