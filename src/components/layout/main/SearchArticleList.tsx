import { type ArticleSearchProps } from "@/types/types";
import { addHistory } from "@/actions/history";
import { addreadLater, deleteReadLater, getReadLater } from "@/actions/readLater";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import ZennSearchPagiNation from "@/components/layout/pagiNation/ZennSearchPagiNation";
import { searchArticles } from "@/actions/article";
import LessPagiNation from "@/components/layout/pagiNation/LessPagiNation";
import PagiNation from "@/components/layout/pagiNation/PagiNation";
import { addFavorite, deleteFavorite, getFavorite } from "@/actions/favorite";
import { ActionButton } from "@/components/layout/button/ActionButton";

export default async function SearchArticleList({
  query,
  currentPage,
  otherPage,
  currentSite,
  isLogin,
}: ArticleSearchProps) {
  const fetchResult = await searchArticles(currentPage, query, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }

  const articles = fetchResult.articles;
  const readLaterUrls = await getReadLater(articles);
  const favoriteUrls = await getFavorite(articles);

  const qiitaPage = currentSite === "Qiita" ? parseInt(currentPage) : parseInt(otherPage);
  const zennPage = currentSite === "Qiita" ? parseInt(otherPage) : parseInt(currentPage);

  const totalPage = "totalPage" in fetchResult ? Math.min(fetchResult.totalPage, 100) : 0;
  const next = "next_page" in fetchResult ? fetchResult.next_page : null;
  const buildHref = (pageNumber: number) => `/search?query=${query}&qiitapage=${pageNumber}&zennpage=${zennPage}`;

  const pagination =
    currentSite === "Qiita" ? (
      totalPage <= 5 ? (
        <LessPagiNation currentPage={qiitaPage} totalPage={totalPage} buildHref={buildHref} />
      ) : (
        <PagiNation currentPage={parseInt(currentPage)} totalPage={totalPage} buildHref={buildHref} />
      )
    ) : (
      <ZennSearchPagiNation query={query} qiitaPage={qiitaPage} zennPage={zennPage} next={next} />
    );

  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">{pagination}</div>
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
      {pagination}
    </div>
  );
}
