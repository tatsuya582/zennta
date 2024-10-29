import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getUser = cache(
  async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    console.log(user);
  
    return user;
  }
)