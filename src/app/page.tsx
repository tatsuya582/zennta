import { SearchForm } from "@/components/layout/form/SearchForm";
import { ArticleList } from "@/components/layout/main/ArticleList";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    qiitapage?: string;
    zennpage?: string;
  };
}) {
  const qiitaPage = searchParams?.qiitapage ? Number(searchParams.qiitapage) : 1;
  const zennPage = searchParams?.zennpage ? Number(searchParams.zennpage) : 1;
  return (
    <>
      <SearchForm linkPage="search" />
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="qiitaarticles">
          Qiita一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ArticleListSkeleton />}>
            <ArticleList currentPage={qiitaPage} otherPage={zennPage} currentSite="Qiita" />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16">
        <h2 className="scroll-mt-20 md:scroll-mt-28" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <ArticleList currentPage={zennPage} otherPage={qiitaPage} currentSite="Zenn" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
