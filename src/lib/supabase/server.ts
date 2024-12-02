"use server";

import { currentUser } from "@/lib/auth/currentUser/server";

export const getSupabaseClientAndUser = async () => {
  return await currentUser();
};
