"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { type zennItem, type Article, type History, type QiitaItem } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export const addHistoryQiita = async (item: QiitaItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase.rpc("insert_history_with_article", {
      articleprovider: "Qiita",
      articlesourcecreatedat: item.created_at,
      articletitle: item.title,
      articleurl: item.url,
      tags: item.tags,
      userid: user.id,
    });

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const addHistoryZenn = async (item: zennItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase.rpc("insert_history_with_article", {
      articleprovider: "Zenn",
      articlesourcecreatedat: item.published_at,
      articletitle: item.title,
      articleurl: `https://zenn.dev${item.path}`,
      tags: null,
      userid: user.id,
    });

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const updateHistory = async (item: Article) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase
      .from("histories")
      .update({ updatedAt: new Date().toISOString() })
      .eq("userId", user.id)
      .eq("articleId", item.id)

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    throw err;
  }
};

export const getHistory = async (): Promise<History[] | null> => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("histories")
      .select(
        `
        updatedAt,
        articles:articleId (id, provider, sourceCreatedAt, url, title, tags)
      `
      )
      .eq("userId", user.id)
      .order("updatedAt", { ascending: false })
      .limit(300);

    return data as History[] | null;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};
