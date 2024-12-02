"use server";

import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async () => {
  const { supabase, user } = await getSupabaseClientAndUser();

  if (!user) {
    return;
  }

  const { data, error } = await supabase.from("users").select("name, avatarUrl").eq("id", user.id).single();

  if (error) {
    console.error("Error fetching user:", error);
  }

  return data;
});

export const updateUser = async (name: string) => {
  const { supabase, user } = await getSupabaseClientAndUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("users").update({ name }).eq("id", user.id);

  if (error) {
    throw new Error("ユーザー情報の更新中にエラーが発生しました: " + error.message);
  }

  redirect("/profile");
};
