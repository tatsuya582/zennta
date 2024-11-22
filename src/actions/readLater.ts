"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { ReadLaterArticle, ReadLaterArticles } from "@/types/databaseCustom.types";
import { type ZennItem, type QiitaItem } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export const addreadLater = async (item: QiitaItem | ZennItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const isQiitaItem = (item: QiitaItem | ZennItem): item is QiitaItem => {
      return "url" in item;
    };

    const { data, error } = await supabase.rpc("insert_read_later_with_article", {
      articleprovider: isQiitaItem(item) ? "Qiita" : "Zenn",
      articlesourcecreatedat: isQiitaItem(item) ? item.created_at : item.published_at,
      articletitle: item.title,
      articleurl: isQiitaItem(item) ? item.url : `https://zenn.dev${item.path}`,
      tags: isQiitaItem(item) ? item.tags : null,
      userid: user.id,
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

export const addDisplayreadLater = async (articleId: string) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase.from("readLaters").insert({ userId: user.id, articleId: articleId });

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const getReadLater = async (
  start: string,
  end: string
): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return new Map();
    }

    const { data } = (await supabase
      .from("readLaters")
      .select(`articles:articleId (id, sourceCreatedAt, url)`)
      .eq("userId", user.id)
      .gte("articles.sourceCreatedAt", start)
      .lte("articles.sourceCreatedAt", end)
      .not("articles", "is", null)) as unknown as { data: ReadLaterArticle[] };

    if (!data) {
      return new Map();
    }

    const readLaterMap = new Map(data.map((item) => [item.articles?.url, item.articles?.id]));
    return readLaterMap;
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const deleteReadLater = async (articleId: string) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase.from("readLaters").delete().eq("userId", user.id).eq("articleId", articleId);

    if (error) {
      throw new Error(`Failed to delete record: ${error.message}`);
    }
    console.log("delete ok");
  } catch (error) {
    console.error("Error deleting read later entry:", error);
  }
};

export const getReadLaterArticles = async (page: number) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();
    const start = 30 * (page - 1);
    const end = 30 * page - 1;

    if (!user) {
      return null;
    }

    const { data } = (await supabase
      .from("readLaters")
      .select(
        `
        articles:articleId (id, title, url, tags)
        `
      )
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .range(start, end)) as unknown as { data: ReadLaterArticles[] };

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
