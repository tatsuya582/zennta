import QiitaArticleListSkeleton from "@/components/layout/skeleton/QiitaArticleListSkeleton";
import ZennArticleListSkeleton from "@/components/layout/skeleton/ZennArticleListSkeleton";
import SearchArticleList from "@/components/layout/search/SearchArticleList";
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

  const onsubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name")?.toString().trim() || "";
    const encodedName = encodeURIComponent(name);
    redirect(`/search?query=${encodedName}`);
  };

  if (!query) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-8">
        <h2>検索</h2>
        <form action={onsubmit} className="flex gap-4 w-9/12 max-w-screen-sm">
          <Input type="name" name="name" />
          <Button>検索</Button>
        </form>
        <p className="text-gray-500 text-sm mt-4">なにか入力してください</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center my-12">
        <form action={onsubmit} className="flex gap-4 w-9/12 max-w-screen-sm">
          <Input type="name" name="name" defaultValue={query} />
          <Button>検索</Button>
        </form>
      </div>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <SearchArticleList query={query} currentPage={qiitaPage} otherPage={zennPage} currentSite="Qiita" />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16">
        <h2 className="linked-section" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<ZennArticleListSkeleton />}>
            <SearchArticleList query={query} currentPage={zennPage} otherPage={qiitaPage} currentSite="Zenn" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
