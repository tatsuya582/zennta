import { getArticles } from "@/actions/article";
import { getFavorite } from "@/actions/favorite";
import { getReadLater } from "@/actions/readLater";
import ArticleListPresentation from "@/components/layout/main/ArticleListPresentation";
import NotArticleError from "@/components/layout/main/NotArticleError";

export default async function ArticleList({
  currentPage,
  otherPage,
  currentSite,
  isLogin,
}: {
  currentPage: string;
  otherPage: string;
  currentSite: "Qiita" | "Zenn";
  isLogin: boolean;
}) {
  const fetchResult = await getArticles(currentPage, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }
  const articles = fetchResult.articles;
  const readLaterUrls = await getReadLater(articles);
  const favoriteUrls = await getFavorite(articles);
  const currentPageNum = parseInt(currentPage);
  const totalPage = 100;
  const buildHref = (page: number) =>
    currentSite === "Qiita"
      ? `/?qiitapage=${page}&zennpage=${otherPage}#qiitaarticles`
      : `/?qiitapage=${otherPage}&zennpage=${page}#zennarticles`;
  return (
    <ArticleListPresentation
      currentPage={currentPageNum}
      totalPage={totalPage}
      buildHref={buildHref}
      articles={articles}
      readLaterUrls={readLaterUrls}
      favoriteUrls={favoriteUrls}
      isLogin={isLogin}
    />
  );
}
