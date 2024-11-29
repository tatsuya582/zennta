import { getArticles } from "@/actions/article";
import { addFavorite, getFavorite } from "@/actions/favorite";
import { addHistory } from "@/actions/history";
import { addreadLater, getReadLater } from "@/actions/readLater";
import { FavoriteButton } from "@/components/layout/button/FavoriteButton";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/pagiNation/PagiNation";

export default async function ArticleList({
  currentPage,
  otherPage,
  currentSite,
}: {
  currentPage: string;
  otherPage: string;
  currentSite: "Qiita" | "Zenn";
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
      ? `/?qiitapage=${page}&zennpage=${otherPage}`
      : `/?qiitapage=${otherPage}&zennpage=${page}#zennarticles`;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <PagiNation currentPage={currentPageNum} totalPage={totalPage} buildHref={buildHref} />
      </div>
      {articles.map((item) => (
        <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
          <div className="flex md:flex-row flex-col justify-between gap-1">
            <Article item={item} onSubmit={addHistory} />
            <div className="flex items-center gap-2">
              <ReadLaterButton item={item} readLaterUrls={readLaterUrls} onSubmit={addreadLater} />
              <FavoriteButton item={item} favoriteUrls={favoriteUrls} onSubmit={addFavorite} />
            </div>
          </div>
        </div>
      ))}
      <PagiNation currentPage={currentPageNum} totalPage={totalPage} buildHref={buildHref} />
    </div>
  );
}
