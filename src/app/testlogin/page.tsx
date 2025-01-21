"use client";

import { Button } from "@/components/ui/button";
import { loginTestUser } from "@/lib/auth/login";
import { useRouter } from "next/navigation";

export default function TestLoginPage() {
  const router = useRouter();
  if (process.env.NODE_ENV === "production") {
    router.push("/");
  }

  const action = async () => {
    await loginTestUser();
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">テスト用ログインページ</h2>

      <Button onClick={action}>ログイン</Button>
    </div>
  );
}
