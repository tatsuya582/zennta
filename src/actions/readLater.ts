"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
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
