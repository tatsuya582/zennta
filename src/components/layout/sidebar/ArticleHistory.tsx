import { addStoredFavorite, deleteFavorite, getFavoriteHistory } from "@/actions/favorite";
import { getHistory, updateHistory } from "@/actions/history";
import { addStoredreadLater, getReadLaterHistory } from "@/actions/readLater";
import { ActionButton } from "@/components/layout/button/ActionButton";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
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
            <ReadLaterButton item={item.articles} readLaterUrls={readLaterUrls} onSubmit={addStoredreadLater} />
            <ActionButton
              item={item.articles}
              id={item.articles.id}
              isOtherTable={favoriteUrls.has(item.articles.url)}
              addLabel="お気に入り登録"
              deleteLabel="お気に入り済み"
              deleteAction={deleteFavorite}
              addAction={addStoredFavorite}
            />
          </div>
        </div>
      ))}
    </>
  );
};
