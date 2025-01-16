import { addStoredItemHistory } from "@/actions/history";
import { Article } from "@/components/layout/main/Article";
import { MemoDisplay } from "@/components/layout/memo/MemoDisplay";
import { type FetchedArticles } from "@/types/databaseCustom.types";

export const GroupArticleList = ({ articles }: { articles: FetchedArticles[] }) => {
  return (
    <div className="mt-4" data-testid="favorite-group-detail">
      <div className="border-b border-gray-300 m-2 pb-1" />
      {articles.map((item, index) => {
        return (
          <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
            <div className="flex md:flex-row flex-col justify-between gap-1" data-testid={`article-${index + 1}`}>
              <div className="flex flex-col justify-center w-full">
                <Article item={item} onSubmit={addStoredItemHistory} />
                {item.memo && <MemoDisplay item={item} displayDeleteButton={false} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
