"use server"

import { type zennArticlesResponse, type QiitaArticlesResponse } from "@/types/types";

export const getQiitaArticles = async ({ page }: { page: string }): Promise<QiitaArticlesResponse | null> => {
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
    const totalCount = response.headers.get("Total-Count");
    const maxPage = totalCount ? Math.ceil(Number(totalCount) / 30) : 1;

    return { articles: data, totalPage: maxPage };
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    return null;
  }
};

export const searchQiitaArticles = async ({
  page,
  query,
}: {
  page: string;
  query: string;
}): Promise<QiitaArticlesResponse | null> => {
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
    const totalCount = response.headers.get("Total-Count");
    const maxPage = totalCount ? Math.ceil(Number(totalCount) / 30) : 1;

    return { articles: data, totalPage: maxPage };
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    return null;
  }
};

export const getZennArticles = async ({ page }: { page: string }): Promise<zennArticlesResponse | null> => {
  try {
    const response = await fetch(`https://zenn.dev/api/articles?page=${page}&order=latest`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    return null;
  }
};

export const searchZennArticles = async ({
  page,
  query,
}: {
  page: string;
  query: string;
}): Promise<zennArticlesResponse | null> => {
  const url = query
    ? `https://zenn.dev/api/search?q=${query}&order=latest&source=articles&page=${page}`
    : `https://zenn.dev/api/articles?page=${page}&order=latest`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_QIITA_API_TOKEN!}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    throw new Error("Failed to fetch articles");
  }
};
