import { addStoredFavorite, getFavoriteHistory } from "@/actions/favorite";
import { getHistory, updateHistory } from "@/actions/history";
import { addStoredreadLater, getReadLaterHistory } from "@/actions/readLater";
import { FavoriteButton } from "@/components/layout/button/FavoriteButton";
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
            <FavoriteButton item={item.articles} favoriteUrls={favoriteUrls} onSubmit={addStoredFavorite} />
          </div>
        </div>
      ))}
    </>
  );
};
