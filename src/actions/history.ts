"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { type ZennItem, type History, type QiitaItem, StoredItem } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export const addHistory = async (item: QiitaItem | ZennItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const data =
      "url" in item
        ? {
            provider: "Qiita",
            sourceCreatedAt: item.created_at,
            title: item.title,
            url: item.url,
            tags: item.tags,
          }
        : {
            provider: "Zenn",
            sourceCreatedAt: item.published_at,
            title: item.title,
            url: `https://zenn.dev${item.path}`,
            tags: null,
          };

    const { error } = await supabase.rpc("insert_history_with_article", {
      articleprovider: data.provider,
      articlesourcecreatedat: data.sourceCreatedAt,
      articletitle: data.title,
      articleurl: data.url,
      tags: data.tags,
      userid: user.id,
    });

    if (error) {
      console.error("Error adding article:", error);
      throw error;
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const addStoredItemHistory = async (item: StoredItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { data } = await supabase.from("histories").select("id").eq("articleId", item.id).eq("userId", user.id);

    if (Array.isArray(data) && data.length > 0) {
      await updateHistory(item);
    } else {
      await supabase.from("histories").insert({ userId: user.id, articleId: item.id });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const updateHistory = async (item: StoredItem) => {
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
      .eq("articleId", item.id);

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
        articles:articleId (id, title, url, tags)
      `
      )
      .eq("userId", user.id)
      .order("updatedAt", { ascending: false })
      .limit(20);

    return data as History[] | null;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};
