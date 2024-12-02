import { getArticles } from "@/actions/article";
import { addFavorite, deleteFavorite, getFavorite } from "@/actions/favorite";
import { addHistory } from "@/actions/history";
import { addreadLater, deleteReadLater, getReadLater } from "@/actions/readLater";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/pagiNation/PagiNation";

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
            {isLogin && (
              <div className="flex items-center gap-2">
                <ActionButton
                  item={item}
                  id={readLaterUrls.get(item.url)}
                  isOtherTable={readLaterUrls.has(item.url)}
                  addLabel="後で読む"
                  deleteLabel="登録済み"
                  deleteAction={deleteReadLater}
                  addAction={addreadLater}
                />
                <ActionButton
                  item={item}
                  id={favoriteUrls.get(item.url)}
                  isOtherTable={favoriteUrls.has(item.url)}
                  addLabel="お気に入り登録"
                  deleteLabel="お気に入り済み"
                  deleteAction={deleteFavorite}
                  addAction={addFavorite}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <PagiNation currentPage={currentPageNum} totalPage={totalPage} buildHref={buildHref} />
    </div>
  );
}
