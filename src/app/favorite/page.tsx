import { addFavoriteByUrl, getFavoriteArticles } from "@/actions/favorite";
import { LinkButton } from "@/components/layout/button/LinkButton";
import { LinkButtonWrapper } from "@/components/layout/button/LinkButtonWrapper";
import { AddArticleForm } from "@/components/layout/form/AddArticleForm";
import { SearchForm } from "@/components/layout/form/SearchForm";
import { FavoritePageGroupList } from "@/components/layout/main/FavoritePageGroupList";
import { StoredArticleList } from "@/components/layout/main/StoredArticleList";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { Metadata } from "next";
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
      <LinkButtonWrapper>
        <LinkButton href="/favorite/create">お気に入りグループ作成</LinkButton>
      </LinkButtonWrapper>
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
      <Suspense>
        <FavoritePageGroupList />
      </Suspense>
    </>
  );
}
