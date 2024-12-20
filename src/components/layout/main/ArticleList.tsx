import { getArticles, searchArticles } from "@/actions/article";
import { getFavorite } from "@/actions/favorite";
import { getReadLater } from "@/actions/readLater";
import { ArticleListPresentation } from "@/components/layout/main/ArticleListPresentation";
import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { LessPagiNation } from "@/components/layout/pagiNation/LessPagiNation";
import { PagiNation } from "@/components/layout/pagiNation/PagiNation";
import { ZennSearchPagiNation } from "@/components/layout/pagiNation/ZennSearchPagiNation";
import { currentUser } from "@/lib/auth/currentUser/server";

export const ArticleList = async ({
  currentPage,
  otherPage,
  currentSite,
  query = "",
  isSearch = false,
}: {
  currentPage: number;
  otherPage: number;
  currentSite: "Qiita" | "Zenn";
  query?: string;
  isSearch?: boolean;
}) => {
  const fetchResult = isSearch
    ? await searchArticles(currentPage, query, currentSite)
    : await getArticles(currentPage, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }
  const articles = fetchResult.articles;
  const readLaterUrls = await getReadLater(articles);
  const favoriteUrls = await getFavorite(articles);
  const { user } = await currentUser();
  const totalPage = "totalPage" in fetchResult ? Math.min(fetchResult.totalPage, 100) : 0;
  const next = "next_page" in fetchResult ? fetchResult.next_page : null;
  const buildHref = (pageNumber: number) => {
    const basePath = isSearch ? `/search?query=${query}&` : `/?`;
    const queryParams =
      currentSite === "Qiita"
        ? `qiitapage=${pageNumber}&zennpage=${otherPage}#qiitaarticles`
        : `qiitapage=${otherPage}&zennpage=${pageNumber}#zennarticles`;
    return basePath + queryParams;
  };
  // nextがあるのはZennの検索
  const pagination = next ? (
    <ZennSearchPagiNation currentPage={currentPage} next={next} buildHref={buildHref} />
  ) : totalPage <= 5 ? (
    <LessPagiNation currentPage={currentPage} totalPage={totalPage} buildHref={buildHref} />
  ) : (
    <PagiNation currentPage={currentPage} totalPage={totalPage} buildHref={buildHref} />
  );
  return (
    <ArticleListPresentation
      pagination={pagination}
      articles={articles}
      readLaterUrls={readLaterUrls}
      favoriteUrls={favoriteUrls}
      isLogin={!!user}
    />
  );
};
