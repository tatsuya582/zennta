import { addFavoriteByUrl, getFavoriteArticles } from "@/actions/favorite";
import { AddArticleForm } from "@/components/layout/form/AddArticleForm";
import { SearchForm } from "@/components/layout/form/SearchForm";
import { StoredArticleList } from "@/components/layout/main/StoredArticleList";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "お気に入り",
};

export default function FavoritePage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;
  const query = searchParams?.query ? searchParams.query : undefined;
  const queryParam = query ? `query=${encodeURIComponent(query)}&` : "";
  const buildHref = (pageNumber: number) => `/favorite?${queryParam}page=${pageNumber}`;

  return (
    <>
      <div className="flex justify-end md:mt-0 mt-4">
        <Button variant="outline">
          <Link href="/favorite/create">お気に入りグループ作成</Link>
        </Button>
      </div>
      <SearchForm key={query} query={query} linkPage="favorite" />
      <AddArticleForm addAction={addFavoriteByUrl} />
      <div
        className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4"
        data-testid="favorite-articles"
      >
        <h2>お気に入り</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense fallback={<ArticleListSkeleton />}>
            <StoredArticleList
              page={page}
              query={query}
              fetchArticles={getFavoriteArticles}
              buildHref={buildHref}
              isFavorite
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
