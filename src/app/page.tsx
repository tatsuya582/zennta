import QiitaArticleList from "@/components/layout/main/QiitaArticleList";
import QiitaArticleListSkeleton from "@/components/layout/main/QiitaArticleListSkeleton";
import ZennArticleList from "@/components/layout/main/ZennArticleList";
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
          <Suspense fallback={<QiitaArticleListSkeleton />}>
            <QiitaArticleList qiitaPage={qiitaPage} zennPage={zennPage} />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col mt-8">
        <h2>Zenn一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">
          <Suspense fallback={<QiitaArticleListSkeleton />}>
            <ZennArticleList qiitaPage={qiitaPage} zennPage={zennPage} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
