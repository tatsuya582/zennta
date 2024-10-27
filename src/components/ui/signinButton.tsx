"use client";
import { signinWithOAuthAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { type Provider } from "@supabase/supabase-js";

type SigninButtonProps = {
  provider: Provider;
};

export function SigninButton({ provider }: SigninButtonProps) {
  return (
    <Button
      size="lg"
      onClick={() => {
        signinWithOAuthAction(provider);
      }}
    >
      {provider}で会員登録
    </Button>
  );
}
