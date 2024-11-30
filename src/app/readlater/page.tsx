import { getReadLaterArticles } from "@/actions/readLater";
import StoredArticleList from "@/components/layout/main/StoredArticleList";
import QiitaArticleListSkeleton from "@/components/layout/skeleton/QiitaArticleListSkeleton";
import { Suspense } from "react";

export default async function ReadLaterPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;
  const query = searchParams?.query ? searchParams.query : null;
  const buildHref = (pageNumber: number) => `/readlater?page=${pageNumber}`;

  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>後で読む</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <StoredArticleList page={page} query={query} fetchArticles={getReadLaterArticles} buildHref={buildHref} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
