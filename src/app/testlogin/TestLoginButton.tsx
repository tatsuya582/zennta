"use client";

import { Button } from "@/components/ui/button";
import { loginTestUser } from "@/lib/auth/login";
import { useRouter } from "next/navigation";

export const TestLogin = () => {
  const router = useRouter();
  const action = async () => {
    await loginTestUser();
    router.refresh();
  };
  return <Button onClick={action}>ログイン</Button>;
};
