import { addStoredFavorite, deleteFavorite } from "@/actions/favorite";
import { updateHistory } from "@/actions/history";
import { addStoredreadLater, deleteReadLater } from "@/actions/readLater";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { Article } from "@/components/layout/main/Article";
import { type History } from "@/types/types";

export const ArticleHistoryPresentation = ({
  history,
  readLaterUrls,
  favoriteUrls,
}: {
  history: History[] | null;
  readLaterUrls: Map<string | undefined, string | undefined>;
  favoriteUrls: Map<string | undefined, string | undefined>;
}) => {
  if (!history) {
    return <div>履歴がありません</div>;
  }
  return (
    <>
      {history.map((item) => (
        <div key={item.articles.id} className="my-2">
          <Article item={item.articles} onSubmit={updateHistory} displayTags={false} />
          <div className="flex space-x-1">
            <ActionButton
              item={item.articles}
              id={readLaterUrls.get(item.articles.url)}
              isTable={readLaterUrls.has(item.articles.url)}
              tableName="readLater"
              deleteAction={deleteReadLater}
              addAction={addStoredreadLater}
              key={readLaterUrls.get(item.articles.url)}
            />
            <ActionButton
              item={item.articles}
              id={favoriteUrls.get(item.articles.url)}
              isTable={favoriteUrls.has(item.articles.url)}
              tableName="favorite"
              deleteAction={deleteFavorite}
              addAction={addStoredFavorite}
              key={favoriteUrls.get(item.articles.url)}
            />
          </div>
        </div>
      ))}
    </>
  );
};
