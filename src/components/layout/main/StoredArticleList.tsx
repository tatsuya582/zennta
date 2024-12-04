import { addStoredFavorite, deleteFavorite } from "@/actions/favorite";
import { addStoredItemHistory } from "@/actions/history";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { AddFavoriteColumnButton } from "@/components/layout/button/AddFavoriteColumnButton";
import { FavoritePageDeleteButton } from "@/components/layout/button/FavoritePageDeleteButton";
import { ReadLaterPageButton } from "@/components/layout/button/ReadLaterPageButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import MemoDisplay from "@/components/layout/memo/MemoDisplay";
import LessPagiNation from "@/components/layout/pagiNation/LessPagiNation";
import PagiNation from "@/components/layout/pagiNation/PagiNation";
import { FetchedArticles } from "@/types/databaseCustom.types";

export default async function StoredArticleList({
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
}) {
  const fetchResult = await fetchArticles(page, query);
  const articles = fetchResult?.articles;

  if (!articles || articles.length === 0) {
    return <NotArticleError />;
  }

  const totalPage = fetchResult.totalPage;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        {totalPage <= 5 ? (
          <LessPagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
        ) : (
          <PagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
        )}
      </div>
      {articles.map((item) => {
        return (
          <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
            <div className="flex md:flex-row flex-col justify-between gap-1">
              <div className="flex flex-col justify-center w-full">
                <Article item={item} onSubmit={addStoredItemHistory} />
                {item.memo && <MemoDisplay item={item} />}
              </div>
              {isFavorite ? (
                <div className="flex flex-col justify-center items-center gap-2">
                  {item.memo ? <AddFavoriteColumnButton item={item} isEdit /> : <AddFavoriteColumnButton item={item} />}
                  <div className="w-full">
                    <FavoritePageDeleteButton item={item} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ReadLaterPageButton item={item} />
                  <ActionButton
                    item={item}
                    id={item.other_column_id}
                    isTable={item.is_in_other_table}
                    tableName="favorite"
                    deleteAction={deleteFavorite}
                    addAction={addStoredFavorite}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
      {totalPage <= 5 ? (
        <LessPagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
      ) : (
        <PagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
      )}
    </div>
  );
}
