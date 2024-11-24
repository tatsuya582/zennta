import ArticleList from "@/components/layout/main/ArticleList";
import QiitaArticleListSkeleton from "@/components/layout/main/QiitaArticleListSkeleton";
import ZennArticleListSkeleton from "@/components/layout/main/ZennArticleListSkeleton";
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
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <ArticleList qiitaPage={qiitaPage} zennPage={zennPage} currentSite="Qiita" />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col my-16">
        <h2 className="linked-section" id="zennarticles">
          Zenn一覧
        </h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<ZennArticleListSkeleton />}>
            <ArticleList qiitaPage={qiitaPage} zennPage={zennPage} currentSite="Zenn" />
          </Suspense>
        </div>
      </div>
    </>
  );
}
