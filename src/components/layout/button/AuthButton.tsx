"use client";
import { Button } from "@/components/ui/button";
import { signinWithOAuthAction } from "@/lib/auth/login";
import { SigninButtonProps } from "@/types/types";

export function AuthButton({ provider, children }: SigninButtonProps) {
  return (
    <Button
      size="lg"
      onClick={() => {
        signinWithOAuthAction(provider);
      }}
    >
      {children}
    </Button>
  );
}
