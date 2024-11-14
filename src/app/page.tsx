import QiitaArticleList from "@/components/layout/main/QiitaArticleList";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = searchParams?.page || "1";

  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">
          <Suspense>
            <QiitaArticleList page={page} />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex justify-center items-center flex-col mt-8">
        <h2>Zenn一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">List</div>
      </div>
    </>
  );
}
