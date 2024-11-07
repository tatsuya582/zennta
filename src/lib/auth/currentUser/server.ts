import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const currentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});
