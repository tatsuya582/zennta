import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { Suspense } from "react";
import { SearchForm } from "@/components/layout/form/SearchForm";
import { Metadata } from "next";
import { ArticleList } from "@/components/layout/main/ArticleList";

export const metadata: Metadata = {
  title: "検索",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    qiitapage?: string;
    zennpage?: string;
  };
}) {
  const qiitaPage = searchParams?.qiitapage ? Number(searchParams.qiitapage) : 1;
  const zennPage = searchParams?.zennpage ? Number(searchParams.zennpage) : 1;
  const query = searchParams?.query ? decodeURIComponent(searchParams.query) : "";

  if (!query) {
    return <SearchForm query={query} linkPage="search" isNoQuery />;
  }

  return (
    <>
      <SearchForm query={query} linkPage="search" key={query} />
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8" data-testid="qiita-articles">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="qiitaarticles">
          Qiita一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ArticleListSkeleton />}>
            <ArticleList currentPage={qiitaPage} otherPage={zennPage} currentSite="Qiita" query={query} isSearch />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16" data-testid="zenn-articles">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <ArticleList currentPage={zennPage} otherPage={qiitaPage} currentSite="Zenn" query={query} isSearch />
          </Suspense>
        </div>
      </div>
    </>
  );
}
