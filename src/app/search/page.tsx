import QiitaArticleListSkeleton from "@/components/layout/skeleton/QiitaArticleListSkeleton";
import ZennArticleListSkeleton from "@/components/layout/skeleton/ZennArticleListSkeleton";
import SearchArticleList from "@/components/layout/main/SearchArticleList";
import { Suspense } from "react";
import SearchForm from "@/components/layout/form/searchForm";
import { currentUser } from "@/lib/auth/currentUser/server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    qiitapage?: string;
    zennpage?: string;
  };
}) {
  const { user } = await currentUser();
  const qiitaPage = searchParams?.qiitapage || "1";
  const zennPage = searchParams?.zennpage || "1";
  const query = searchParams?.query ? decodeURIComponent(searchParams.query) : "";

  if (!query) {
    return <SearchForm query={query} linkPage="search" isNoQuery />;
  }

  return (
    <>
      <SearchForm query={query} linkPage="search" key={query} />
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <SearchArticleList
              query={query}
              currentPage={qiitaPage}
              otherPage={zennPage}
              currentSite="Qiita"
              isLogin={!!user}
            />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<ZennArticleListSkeleton />}>
            <SearchArticleList
              query={query}
              currentPage={zennPage}
              otherPage={qiitaPage}
              currentSite="Zenn"
              isLogin={!!user}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
