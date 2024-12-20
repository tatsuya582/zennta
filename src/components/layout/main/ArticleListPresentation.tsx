import { addFavorite, deleteFavorite } from "@/actions/favorite";
import { addHistory } from "@/actions/history";
import { addreadLater, deleteReadLater } from "@/actions/readLater";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { Article } from "@/components/layout/main/Article";
import { type FetchedItem } from "@/types/types";

export const ArticleListPresentation = ({
  pagination,
  articles,
  readLaterUrls,
  favoriteUrls,
  isLogin,
}: {
  pagination: React.ReactNode;
  articles: FetchedItem[];
  readLaterUrls: Map<string | undefined, string | undefined>;
  favoriteUrls: Map<string | undefined, string | undefined>;
  isLogin: boolean;
}) => {
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
};
