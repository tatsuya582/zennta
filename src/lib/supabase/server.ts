"use server";

import { currentUser } from "@/lib/auth/currentUser/server";
import { createClient } from "@/utils/supabase/server";

export const getSupabaseClientAndUser = async () => {
  const supabase = await createClient();
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return { supabase, user };
};
