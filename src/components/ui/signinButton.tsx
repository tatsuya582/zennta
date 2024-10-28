"use client";
import { signinWithOAuthAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { SigninButtonProps } from "@/types/types";

export function SigninButton({ provider, children }: SigninButtonProps) {
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
