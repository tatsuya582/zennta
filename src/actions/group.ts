"use server";

import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { type fetchGroupArticles, type groupArticle } from "@/types/types";

export const addFavoriteGroup = async (articles: groupArticle[], title: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("favoriteGroups")
      .insert({ articles, title, userId: user.id })
      .select("id");

    if (error) {
      throw new Error(error.message);
    }
    return data[0].id;
  } catch (error) {
    console.error(`Error adding favoriteGroup:`, error);
    throw error;
  }
};

export const getCreateGroupArticles = async (page: number, query: string | undefined) => {
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
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
};
