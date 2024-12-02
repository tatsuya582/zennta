import SearchForm from "@/components/layout/form/searchForm";
import ArticleList from "@/components/layout/main/ArticleList";
import QiitaArticleListSkeleton from "@/components/layout/skeleton/QiitaArticleListSkeleton";
import ZennArticleListSkeleton from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    qiitapage?: string;
    zennpage?: string;
  };
}) {
  const qiitaPage = searchParams?.qiitapage || "1";
  const zennPage = searchParams?.zennpage || "1";
  return (
    <>
      <SearchForm linkPage="search" />
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <ArticleList currentPage={qiitaPage} otherPage={zennPage} currentSite="Qiita" />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16">
        <h2 className="linked-section" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<ZennArticleListSkeleton />}>
            <ArticleList currentPage={zennPage} otherPage={qiitaPage} currentSite="Zenn" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
