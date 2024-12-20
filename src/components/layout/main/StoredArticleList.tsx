import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { StoredArticleListPresentation } from "@/components/layout/main/StoredArticleListPresentation";
import { LessPagiNation } from "@/components/layout/pagiNation/LessPagiNation";
import { PagiNation } from "@/components/layout/pagiNation/PagiNation";
import { type FetchedArticles } from "@/types/databaseCustom.types";

export const StoredArticleList = async ({
  page,
  query,
  fetchArticles,
  buildHref,
  isFavorite = false,
}: {
  page: number;
  query: string | undefined;
  fetchArticles: (
    page: number,
    query: string | undefined
  ) => Promise<{ articles: FetchedArticles[]; totalPage: number } | undefined>;
  buildHref: (pageNumber: number) => string;
  isFavorite?: boolean;
}) => {
  const fetchResult = await fetchArticles(page, query);
  const articles = fetchResult?.articles;

  if (!articles || articles.length === 0) {
    return <NotArticleError />;
  }

  const totalPage = fetchResult.totalPage;
  const pagination =
    totalPage <= 5 ? (
      <LessPagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
    ) : (
      <PagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
    );
  return <StoredArticleListPresentation pagination={pagination} articles={articles} isFavorite={isFavorite} />;
};
