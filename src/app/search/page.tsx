import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { SearchArticleList } from "@/components/layout/main/SearchArticleList";
import { Suspense } from "react";
import { SearchForm } from "@/components/layout/form/SearchForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "検索",
};

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

  if (!query) {
    return <SearchForm query={query} linkPage="search" isNoQuery />;
  }

  return (
    <>
      <SearchForm query={query} linkPage="search" key={query} />
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="qiitaarticles">
          Qiita一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ArticleListSkeleton />}>
            <SearchArticleList query={query} currentPage={qiitaPage} otherPage={zennPage} currentSite="Qiita" />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <SearchArticleList query={query} currentPage={zennPage} otherPage={qiitaPage} currentSite="Zenn" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
