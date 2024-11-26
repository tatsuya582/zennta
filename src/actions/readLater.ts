"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { ReadLaterArticle, ReadLaterArticles } from "@/types/databaseCustom.types";
import { StoredItem, type FetchedItem } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export const addreadLater = async (item: FetchedItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase.rpc("insert_read_later_with_article", {
      userid: user.id,
      articleurl: item.url,
      articletitle: item.title,
      articlesourcecreatedat: item.created_at,
      tags: item.tags,
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

export const addStoredreadLater = async (item: StoredItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase.from("readLaters").insert({ userId: user.id, articleId: item.id });

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

export const getReadLaterHistory = async (): Promise<Map<string | undefined, string | undefined>> => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return new Map();
    }

    const { data } = (await supabase
      .from("readLaters")
      .select(`articles:articleId (id, url)`)
      .eq("userId", user.id)
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

    const { data, count } = (await supabase
      .from("readLaters")
      .select(
        `
        articles:articleId (id, title, url, tags)
        `,
        { count: "exact" }
      )
      .eq("userId", user.id)
      .order("createdAt", { ascending: false })
      .range(start, end)) as unknown as { data: ReadLaterArticles[]; count: number | null };

    const totalPage = count !== null ? Math.ceil(count / 30) : 1;

    return { articles: data, totalPage };
  } catch (error) {
    console.error("Unexpected error:", error);
    throw error;
  }
};
