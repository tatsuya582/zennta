"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { ReadLaterArticle } from "@/types/databaseCustom.types";
import { type QiitaItem } from "@/types/types";
import { createClient } from "@/utils/supabase/server";

export const addreadLaterQiita = async (item: QiitaItem) => {
  try {
    const supabase = await createClient();
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const { error } = await supabase.rpc("insert_read_later_with_article", {
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
