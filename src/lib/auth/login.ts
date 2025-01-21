import { createClient } from "@/utils/supabase/client";
import { type Provider } from "@supabase/supabase-js";

export const signinWithOAuthAction = async (provider: Provider) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}auth/callback`,
    },
  });

  if (error) {
    console.error(`${provider}認証中にエラーが発生しました:`, error);
  }
};

export const loginTestUser = async () => {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: process.env.NEXT_PUBLIC_TEST_USER_EMAIL!,
    password: process.env.NEXT_PUBLIC_TEST_PASSWORD!,
  });

  if (error) {
    console.error("ログイン中ににエラーが発生しました:", error);
  }
};
