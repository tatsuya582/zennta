import { createClient } from "@/utils/supabase/client";
import { type Provider } from "@supabase/supabase-js";

export const signinWithOAuthAction = async (provider: Provider) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(`${provider}認証中にエラーが発生しました:`, error);
  }
};
