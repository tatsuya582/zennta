import { addFavorite, deleteFavorite } from "@/actions/favorite";
import { addHistory } from "@/actions/history";
import { addreadLater, deleteReadLater } from "@/actions/readLater";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { Article } from "@/components/layout/main/Article";
import PagiNation from "@/components/layout/pagiNation/PagiNation";
import { FetchedItem } from "@/types/types";

export default async function ArticleListPresentation({
  currentPage,
  totalPage,
  buildHref,
  articles,
  readLaterUrls,
  favoriteUrls,
  isLogin,
}: {
  currentPage: number;
  totalPage: number;
  buildHref: (pageNumber: number) => string;
  articles: FetchedItem[];
  readLaterUrls: Map<string | undefined, string | undefined>;
  favoriteUrls: Map<string | undefined, string | undefined>;
  isLogin: boolean;
}) {
  return (
    <div>
      <div className="border-b border-gray-300 my-2 pb-4">
        <PagiNation currentPage={currentPage} totalPage={totalPage} buildHref={buildHref} />
      </div>
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
      <div className="mt-4 mb-2">
        <PagiNation currentPage={currentPage} totalPage={totalPage} buildHref={buildHref} />
      </div>
    </div>
  );
}
