import { redirect } from "next/navigation";

export default function TestLoginPage() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">テスト用ログインページ</h2>

      <TestLoginPage />
    </div>
  );
}
