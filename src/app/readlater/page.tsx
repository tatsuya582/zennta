import ReadLsterArticleList from "@/components/layout/readLater/ReadLaterArticleList";
import QiitaArticleListSkeleton from "@/components/layout/skeleton/QiitaArticleListSkeleton";
import { Suspense } from "react";

export default async function ReadLaterPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;

  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>後で読む</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <ReadLsterArticleList page={page} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
