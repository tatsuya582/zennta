import { addStoredFavorite, deleteFavorite } from "@/actions/favorite";
import { addStoredItemHistory } from "@/actions/history";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { AddFavoriteColumnButton } from "@/components/layout/button/AddFavoriteColumnButton";
import { FavoritePageButton } from "@/components/layout/button/FavoritePageButton";
import { ReadLaterPageButton } from "@/components/layout/button/ReadLaterPageButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import LessPagiNation from "@/components/layout/pagiNation/LessPagiNation";
import PagiNation from "@/components/layout/pagiNation/PagiNation";
import { Button } from "@/components/ui/button";
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
  ) => Promise<{ articles: FetchedArticles[]; totalPage: number }>;
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
              <div className="w-full">
                <Article item={item} onSubmit={addStoredItemHistory} />
                {item.memo && (
                  <div className="flex justify-start w-full ml-4 my-2">
                    <div
                      className="w-11/12 border rounded-lg border-gray-300 px-4 py-2"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      <div>{item.memo}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">メモを削除</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isFavorite ? (
                <div className="flex flex-col justify-center items-center gap-2">
                  {item.memo ? <Button className="w-full" variant="outline">メモを編集</Button> : <AddFavoriteColumnButton item={item} />}
                  <FavoritePageButton item={item} />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ReadLaterPageButton item={item} />
                  <ActionButton
                    item={item}
                    id={item.id}
                    isOtherTable={item.is_in_other_table}
                    addLabel="お気に入り登録"
                    deleteLabel="お気に入り済み"
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
