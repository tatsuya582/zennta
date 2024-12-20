"use client";
import { Button } from "@/components/ui/button";
import { signinWithOAuthAction } from "@/lib/auth/login";
import { type SigninButtonProps } from "@/types/types";

export const AuthButton = ({ provider, children }: SigninButtonProps) => {
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
};
