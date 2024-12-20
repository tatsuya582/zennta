import { getArticles } from "@/actions/article";
import { getFavorite } from "@/actions/favorite";
import { getReadLater } from "@/actions/readLater";
import { ArticleListPresentation } from "@/components/layout/main/ArticleListPresentation";
import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { PagiNation } from "@/components/layout/pagiNation/PagiNation";
import { currentUser } from "@/lib/auth/currentUser/server";

export const ArticleList = async ({
  currentPage,
  otherPage,
  currentSite,
}: {
  currentPage: number;
  otherPage: number;
  currentSite: "Qiita" | "Zenn";
}) => {
  const { user } = await currentUser();
  const fetchResult = await getArticles(currentPage, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }
  const articles = fetchResult.articles;
  const readLaterUrls = await getReadLater(articles);
  const favoriteUrls = await getFavorite(articles);
  const totalPage = 100;
  const buildHref = (page: number) =>
    currentSite === "Qiita"
      ? `/?qiitapage=${page}&zennpage=${otherPage}#qiitaarticles`
      : `/?qiitapage=${otherPage}&zennpage=${page}#zennarticles`;
  const pagination = <PagiNation currentPage={currentPage} totalPage={totalPage} buildHref={buildHref} />;
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
