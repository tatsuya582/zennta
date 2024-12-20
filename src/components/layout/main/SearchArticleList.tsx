import { type ArticleSearchProps } from "@/types/types";
import { getReadLater } from "@/actions/readLater";
import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { ZennSearchPagiNation } from "@/components/layout/pagiNation/ZennSearchPagiNation";
import { searchArticles } from "@/actions/article";
import { LessPagiNation } from "@/components/layout/pagiNation/LessPagiNation";
import { PagiNation } from "@/components/layout/pagiNation/PagiNation";
import { getFavorite } from "@/actions/favorite";
import { ArticleListPresentation } from "@/components/layout/main/ArticleListPresentation";
import { currentUser } from "@/lib/auth/currentUser/server";

export const SearchArticleList = async ({ query, currentPage, otherPage, currentSite }: ArticleSearchProps) => {
  const fetchResult = await searchArticles(currentPage, query, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }

  const articles = fetchResult.articles;
  const readLaterUrls = await getReadLater(articles);
  const favoriteUrls = await getFavorite(articles);
  const { user } = await currentUser();

  const qiitaPage = currentSite === "Qiita" ? parseInt(currentPage) : parseInt(otherPage);
  const zennPage = currentSite === "Qiita" ? parseInt(otherPage) : parseInt(currentPage);

  const totalPage = "totalPage" in fetchResult ? Math.min(fetchResult.totalPage, 100) : 0;
  const next = "next_page" in fetchResult ? fetchResult.next_page : null;
  const buildHref = (pageNumber: number) =>
    currentSite === "Qiita"
      ? `/search?query=${query}&qiitapage=${pageNumber}&zennpage=${zennPage}#qiitaarticles`
      : `/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${pageNumber}#zennarticles`;

  const pagination =
    currentSite === "Qiita" ? (
      totalPage <= 5 ? (
        <LessPagiNation currentPage={qiitaPage} totalPage={totalPage} buildHref={buildHref} />
      ) : (
        <PagiNation currentPage={parseInt(currentPage)} totalPage={totalPage} buildHref={buildHref} />
      )
    ) : (
      <ZennSearchPagiNation currentPage={zennPage} next={next} buildHref={buildHref} />
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
