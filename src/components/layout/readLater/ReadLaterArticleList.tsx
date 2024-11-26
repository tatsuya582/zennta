import { addStoredItemHistory } from "@/actions/history";
import { getReadLaterArticles } from "@/actions/readLater";
import { StoredReadLaterButton } from "@/components/layout/button/StoredReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import LessPagiNation from "@/components/layout/pagiNation/LessPagiNation";
import StoredPagiNation from "@/components/layout/pagiNation/StoredPagiNation";
import { Button } from "@/components/ui/button";

export default async function ReadLsterArticleList({ page }: { page: number }) {
  const fetchResult = await getReadLaterArticles(page);
  const articles = fetchResult?.articles;

  if (!articles) {
    return <NotArticleError />;
  }

  const totalPage = fetchResult.totalPage;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        {totalPage <= 5 ? (
          <LessPagiNation
            currentPage={page}
            totalPage={totalPage}
            buildHref={(pageNumber) => `/readlater?page=${pageNumber}`}
          />
        ) : (
          <StoredPagiNation currentPage={page} totalPage={totalPage} />
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
        <LessPagiNation
          currentPage={page}
          totalPage={totalPage}
          buildHref={(pageNumber) => `/readlater?page=${pageNumber}`}
        />
      ) : (
        <StoredPagiNation currentPage={page} totalPage={totalPage} />
      )}
    </div>
  );
}
