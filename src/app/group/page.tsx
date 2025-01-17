import { GroupList } from "@/components/layout/main/GroupList";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "お気に入りグループ",
};

export default function GroupPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;
  const buildHref = (pageNumber: number) => `/group?page=${pageNumber}`;

  return (
    <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4" data-testid="favorite-group">
      <h2>公開中のお気に入りグループ</h2>
      <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
        <Suspense fallback={<ArticleListSkeleton />}>
          <GroupList page={page} buildHref={buildHref} />
        </Suspense>
      </div>
    </div>
  );
}
