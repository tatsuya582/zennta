"use server";

import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { type History, type StoredItem, type FetchedItem } from "@/types/types";

export const addHistory = async (item: FetchedItem) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { error } = await supabase.rpc("insert_history_with_article", {
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
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};

export const addStoredItemHistory = async (item: StoredItem) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    const { error } = await supabase.rpc("add_or_update_history", {
      user_id: user.id,
      article_id: item.id,
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

export const updateHistory = async (item: StoredItem) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

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
    const { supabase, user } = await getSupabaseClientAndUser();

    const { data } = await supabase
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
