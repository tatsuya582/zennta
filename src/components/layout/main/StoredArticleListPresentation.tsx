import { addStoredItemHistory } from "@/actions/history";
import { AddFavoriteColumnButton } from "@/components/layout/button/AddFavoriteColumnButton";
import { FavoritePageDeleteButton } from "@/components/layout/button/FavoritePageDeleteButton";
import { ReadLaterPageButton } from "@/components/layout/button/ReadLaterPageButton";
import { Article } from "@/components/layout/main/Article";
import { MemoDisplay } from "@/components/layout/memo/MemoDisplay";
import { type FetchedArticles } from "@/types/databaseCustom.types";

export const StoredArticleListPresentation = ({
  pagination,
  articles,
  isFavorite = false,
}: {
  pagination: React.ReactNode;
  articles: FetchedArticles[];
  isFavorite?: boolean;
}) => {
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">{pagination}</div>
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
                  <AddFavoriteColumnButton item={item} isEdit={!!item.memo} />
                  <div className="w-full">
                    <FavoritePageDeleteButton item={item} />
                  </div>
                </div>
              ) : (
                <ReadLaterPageButton item={item} />
              )}
            </div>
          </div>
        );
      })}
      {pagination}
    </div>
  );
};
