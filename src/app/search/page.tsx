import QiitaArticleListSkeleton from "@/components/layout/main/QiitaArticleListSkeleton";
import QiitaArticleSearch from "@/components/layout/search/QiitaArticleSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    qiitapage?: string;
    zennpage?: string;
  };
}) {
  const qiitaPage = searchParams?.qiitapage || "1";
  const zennPage = searchParams?.zennpage || "1";
  const query = searchParams?.query ? decodeURIComponent(searchParams.query) : "";

  const onsubmit = async(formData: FormData) => {
    "use server"
    const name = formData.get("name")?.toString().trim() || "";
    const encodedName = encodeURIComponent(name);
    console.log(encodedName);
    redirect(`/search?query=${encodedName}`);
  }

  if (!query) {
    return (
      
      <div className="h-[80vh] flex flex-col items-center justify-center gap-8">
        <h2>検索</h2>
        <form action={onsubmit} className="flex gap-4 w-9/12 max-w-screen-sm">
          <Input type="name" name="name"/>
          <Button>検索</Button>
        </form>
        <p className="text-gray-500 text-sm mt-4">なにか入力してください</p>
      </div>
    )
  }

  return (
    <>
      
    </>
  );
}
