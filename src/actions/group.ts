"use server";

import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { type FetchedArticles, type groupByUser } from "@/types/databaseCustom.types";
import { type fetchGroupArticles, type groupArticle } from "@/types/types";

export const addFavoriteGroup = async (articles: groupArticle[], title: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase.rpc("add_favorite_group", {
      user_id: user.id,
      group_title: title,
      articles: articles,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error adding favoriteGroup:`, error);
    throw error;
  }
};

export const editFavoriteGroup = async (articles: groupArticle[], title: string, groupId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase.rpc("edit_favorite_group", {
      user_id: user.id,
      group_id: groupId,
      group_title: title,
      articles: articles,
    });

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`Error editing favoriteGroup:`, error);
    throw error;
  }
};

export const deleteFavoriteGroup = async (groupId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { error } = await supabase.from("favoriteGroups").delete().eq("id", groupId).eq("userId", user.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error editing favoriteGroup:`, error);
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

    const { data } = (await supabase.rpc("fetch_create_group_articles", {
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

export const getFavoriteGroupTitle = async (groupId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data } = await supabase.from("favoriteGroups").select("title").eq("id", groupId).single();

    if (!data?.title) {
      return null;
    }
    return data.title;
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
};

export const getFavoriteGroupByUser = async () => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase.rpc("fetch_user_favorite_groups_and_articles", {
      user_id: user.id,
    });

    if (error) {
      throw error;
    }

    return data as groupByUser[] | null;
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
};

export const getFavoriteGroup = async (groupId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data } = await supabase.rpc("fetch_articles_by_favorite_group", {
      group_id: groupId,
    });

    return data as FetchedArticles[] | null;
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
};

export const getFavoriteEditGroup = async (groupId: string) => {
  try {
    const { supabase, user } = await getSupabaseClientAndUser();

    if (!user) {
      return;
    }

    const { data } = (await supabase.rpc("fetch_edit_group", {
      group_id: groupId,
    })) as unknown as { data: groupArticle[] };

    return data;
  } catch (error) {
    console.error(`Error fetching articles:`, error);
    throw error;
  }
};
