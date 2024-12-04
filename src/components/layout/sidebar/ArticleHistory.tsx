import { addStoredFavorite, deleteFavorite, getFavoriteHistory } from "@/actions/favorite";
import { getHistory, updateHistory } from "@/actions/history";
import { addStoredreadLater, deleteReadLater, getReadLaterHistory } from "@/actions/readLater";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { Article } from "@/components/layout/main/Article";

export const ArticleHistory = async () => {
  const history = await getHistory();
  const readLaterUrls = await getReadLaterHistory();
  const favoriteUrls = await getFavoriteHistory();
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
            />
            <ActionButton
              item={item.articles}
              id={favoriteUrls.get(item.articles.url)}
              isTable={favoriteUrls.has(item.articles.url)}
              tableName="favorite"
              deleteAction={deleteFavorite}
              addAction={addStoredFavorite}
            />
          </div>
        </div>
      ))}
    </>
  );
};
