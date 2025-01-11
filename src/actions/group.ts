"use server";

import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { fetchGroupArticles } from "@/types/types";

export const getGroupArticles = async (page: number, query: string | undefined) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const normalizeQuery = query ? query.replace(/　/g, " ").replace(/\s+/g, " ").trim() : "";

    const { data } = (await supabase.rpc("fetch_create_group__articles", {
      user_id: user.id,
      page: page,
      query: normalizeQuery,
    })) as unknown as { data: fetchGroupArticles };

    const totalPage = data?.total_count ? Math.ceil(data.total_count / 30) : 1;

    return { articles: data?.articles, totalPage };
  } catch (err) {
    console.error(`Error fetching articles:`, err);
    throw err;
  }
};
