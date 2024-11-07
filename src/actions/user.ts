"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async () => {
  const supabase = await createClient();
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.from("users").select("name, avatarUrl").eq("id", user.id).single();

  if (error) {
    console.error("Error fetching user:", error);
  }

  return data;
});

export const updateUser = async (name: string) => {
  const supabase = await createClient();
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("users").update({ name }).eq("id", user.id);

  if (error) {
    throw new Error("ユーザー情報の更新中にエラーが発生しました: " + error.message);
  }

  redirect("/profile");
};
