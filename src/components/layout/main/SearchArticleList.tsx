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
    <div>
      <div className="border-b border-gray-300 my-2 pb-4">{pagination}</div>
      <div className="mt-2">
        {articles.map((item) => (
          <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
            <div className="flex md:flex-row flex-col justify-between gap-1">
              <Article item={item} onSubmit={addHistory} />
              {isLogin && (
                <div className="flex items-center gap-2">
                  <ActionButton
                    item={item}
                    id={readLaterUrls.get(item.url)}
                    isTable={readLaterUrls.has(item.url)}
                    tableName="readLater"
                    deleteAction={deleteReadLater}
                    addAction={addreadLater}
                    key={readLaterUrls.get(item.url)}
                  />
                  <ActionButton
                    item={item}
                    id={favoriteUrls.get(item.url)}
                    isTable={favoriteUrls.has(item.url)}
                    tableName="favorite"
                    deleteAction={deleteFavorite}
                    addAction={addFavorite}
                    key={favoriteUrls.get(item.url)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 mb-2">{pagination}</div>
    </div>
  );
}
