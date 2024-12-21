import { getFavoriteHistory } from "@/actions/favorite";
import { getHistory } from "@/actions/history";
import { getReadLaterHistory } from "@/actions/readLater";
import { ArticleHistoryPresentation } from "@/components/layout/sidebar/ArticleHistoryPresentation";

export const ArticleHistory = async () => {
  const history = await getHistory();
  const readLaterUrls = await getReadLaterHistory();
  const favoriteUrls = await getFavoriteHistory();
  return <ArticleHistoryPresentation history={history} readLaterUrls={readLaterUrls} favoriteUrls={favoriteUrls} />;
};
