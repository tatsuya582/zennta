"use server";

import {
  addArticle,
  addArticleByUrl,
  deleteArticle,
  getArticle,
  getArticleHistory,
  getArticles,
} from "@/actions/storedArticle";
import { type StoredItem, type FetchedItem } from "@/types/types";

export const addreadLater = async (item: FetchedItem) => {
  return addArticle("readLaters", item, "insert_read_later_with_article");
};

export const addStoredreadLater = async (item: StoredItem) => {
  return addArticle("readLaters", item);
};

export const getReadLater = async (items: FetchedItem[]): Promise<Map<string | undefined, string | undefined>> => {
  return getArticle("readLaters", items);
};

export const getReadLaterHistory = async (): Promise<Map<string | undefined, string | undefined>> => {
  return getArticleHistory("readLaters");
};

export const deleteReadLater = async (articleId: string) => {
  deleteArticle("readLaters", articleId);
};

export const getReadLaterArticles = async (page: number, query: string | undefined) => {
  return getArticles("fetch_read_laters_articles_with_count", page, query);
};

export const addReadLaterByUrl = async (url: string) => {
  return addArticleByUrl(url, "insert_read_later_with_article");
};
