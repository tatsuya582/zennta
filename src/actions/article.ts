"use server";

import { type ZennArticlesResponse, type QiitaArticlesResponse, type QiitaItem, type ZennItem } from "@/types/types";

const fetchQiitaArticles = async (page: string): Promise<QiitaArticlesResponse | null> => {
  try {
    const response = await fetch(`https://qiita.com/api/v2/items?page=${page}&per_page=30`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_QIITA_API_TOKEN!}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const filteredData = data.map((item: QiitaItem) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      tags: item.tags,
      created_at: item.created_at,
    }));

    return { articles: filteredData, totalPage: 100 };
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    return null;
  }
};

const fetchZennArticles = async (page: string): Promise<ZennArticlesResponse | null> => {
  try {
    const response = await fetch(`https://zenn.dev/api/articles?page=${page}&order=latest`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const filteredData = data.articles.map((item: ZennItem) => ({
      id: item.id,
      title: item.title,
      url: `https://zenn.dev${item.path}`,
      tags: null,
      created_at: item.published_at,
    }));
    return { articles: filteredData, next_page: data.next_page };
  } catch (error) {
    console.error("Error fetching Zenn items:", error);
    return null;
  }
};

export const getArticles = async <T extends QiitaArticlesResponse | ZennArticlesResponse>(
  page: string,
  site: "Qiita" | "Zenn"
): Promise<T | null> => {
  return (site === "Qiita" ? await fetchQiitaArticles(page) : await fetchZennArticles(page)) as T | null;
};

const searchQiitaArticles = async (page: string, query: string): Promise<QiitaArticlesResponse | null> => {
  const url = `https://qiita.com/api/v2/items?page=${page}&per_page=30${query ? `&query=${query}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_QIITA_API_TOKEN!}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const filteredData = data.map((item: QiitaItem) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      tags: item.tags,
      created_at: item.created_at,
    }));
    const totalCount = response.headers.get("Total-Count");
    const maxPage = totalCount ? Math.ceil(Number(totalCount) / 30) : 1;

    return { articles: filteredData, totalPage: maxPage };
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    return null;
  }
};

const searchZennArticles = async (page: string, query: string): Promise<ZennArticlesResponse | null> => {
  const url = query
    ? `https://zenn.dev/api/search?q=${query}&order=latest&source=articles&page=${page}`
    : `https://zenn.dev/api/articles?page=${page}&order=latest`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const filteredData = data.articles.map((item: ZennItem) => ({
      id: item.id,
      title: item.title,
      url: `https://zenn.dev${item.path}`,
      tags: null,
      created_at: item.published_at,
    }));
    return { articles: filteredData, next_page: data.next_page };
  } catch (error) {
    console.error("Error fetching Zenn items:", error);
    return null;
  }
};

export const searchArticles = async <T extends QiitaArticlesResponse | ZennArticlesResponse>(
  page: string,
  query: string,
  site: "Qiita" | "Zenn"
): Promise<T | null> => {
  return (site === "Qiita" ? await searchQiitaArticles(page, query) : searchZennArticles(page, query)) as T | null;
};
