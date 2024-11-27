import { addStoredItemHistory } from "@/actions/history";
import { getReadLaterArticles } from "@/actions/readLater";
import { StoredReadLaterButton } from "@/components/layout/button/StoredReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import LessPagiNation from "@/components/layout/pagiNation/LessPagiNation";
import PagiNation from "@/components/layout/pagiNation/PagiNation";
import { Button } from "@/components/ui/button";

export default async function ReadLsterArticleList({ page }: { page: number }) {
  const fetchResult = await getReadLaterArticles(page);
  const articles = fetchResult?.articles;

  if (!articles || articles.length === 0) {
    return <NotArticleError />;
  }

  const totalPage = fetchResult.totalPage;
  const buildHref = (pageNumber: number) => `/readlater?page=${pageNumber}`;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        {totalPage <= 5 ? (
          <LessPagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
        ) : (
          <PagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
        )}
      </div>
      {articles.map((item) => {
        return (
          <div key={item.articles.id} className="border-b border-gray-300 m-2 pb-1">
            <div className="flex md:flex-row flex-col justify-between gap-1">
              <Article item={item.articles} onSubmit={addStoredItemHistory} />
              <div className="flex items-center gap-2">
                <StoredReadLaterButton item={item.articles} />
                <Button className="flex-1">お気に入り</Button>
              </div>
            </div>
          </div>
        );
      })}
      {totalPage <= 5 ? (
        <LessPagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
      ) : (
        <PagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
      )}
    </div>
  );
}
