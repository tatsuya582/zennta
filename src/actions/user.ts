"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { createClient } from "@/utils/supabase/server";
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
