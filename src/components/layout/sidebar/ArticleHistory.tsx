import { getHistory, updateHistory } from "@/actions/history";
import { getReadLaterHistory } from "@/actions/readLater";
import { HistoryButton } from "@/components/layout/button/HistoryButton";
import { Article } from "@/components/layout/main/Article";
import { Button } from "@/components/ui/button";

export const ArticleHistory = async () => {
  const history = await getHistory();
  const readLaterUrls = await getReadLaterHistory();
  if (!history) {
    return <div>履歴がありません</div>;
  }
  return (
    <>
      {history.map((item) => (
        <div key={item.articles.id} className="my-2">
          <Article item={item.articles} onSubmit={updateHistory} displayTags={false} />
          <div className="flex space-x-1">
            <HistoryButton item={item.articles} readLaterUrls={readLaterUrls} />
            <Button className="flex-1">お気に入り</Button>
          </div>
        </div>
      ))}
    </>
  );
};
