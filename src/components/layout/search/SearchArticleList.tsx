import { addHistory } from "@/actions/history";
import { addreadLater, getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";
import QiitaSearchPagiNation from "@/components/layout/pagiNation/QiitaSearchPagiNation";
import ZennSearchPagiNation from "@/components/layout/pagiNation/ZennSearchPagiNation";
import { searchArticles } from "@/actions/article";
import { type SearchPagiNationProps, type ArticleSearchProps } from "@/types/types";
import LessPagiNation from "@/components/layout/pagiNation/LessPagiNation";

export default async function SearchArticleList({ query, currentPage, otherPage, currentSite }: ArticleSearchProps) {
  const fetchResult = await searchArticles(currentPage, query, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }

  const articles = fetchResult.articles;
  const readLaterRange = getArticleDateRange(articles);
  const readLaterUrls =
    readLaterRange.start && readLaterRange.end
      ? await getReadLater(readLaterRange.start, readLaterRange.end)
      : new Map();

  const qiitaPage = currentSite === "Qiita" ? parseInt(currentPage) : parseInt(otherPage);
  const zennPage = currentSite === "Qiita" ? parseInt(otherPage) : parseInt(currentPage);

  const totalPage = "totalPage" in fetchResult ? Math.min(fetchResult.totalPage, 100) : 0;
  const next = "next_page" in fetchResult ? fetchResult.next_page : null;

  const PaginationComponent =
    currentSite === "Qiita"
      ? totalPage <= 5
        ? () => (
            <LessPagiNation
              currentPage={qiitaPage}
              totalPage={totalPage}
              buildHref={(pageNumber) => `/search?query=${query}&qiitapage=${pageNumber}&zennpage=${zennPage}`}
            />
          )
        : (props: SearchPagiNationProps) => <QiitaSearchPagiNation {...props} totalPage={totalPage} />
      : (props: SearchPagiNationProps) => <ZennSearchPagiNation {...props} next={next} />;

  const renderPagination = () => {
    return <PaginationComponent query={query} qiitaPage={qiitaPage} zennPage={zennPage} />;
  };
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">{renderPagination()}</div>
      {articles.map((item) => (
        <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
          <div className="flex md:flex-row flex-col justify-between gap-1">
            <Article item={item} onSubmit={addHistory} />
            <div className="flex items-center gap-2">
              <ReadLaterButton item={item} readLaterUrls={readLaterUrls} onSubmit={addreadLater} />
              <Button className="flex-1">お気に入り</Button>
            </div>
          </div>
        </div>
      ))}
      {renderPagination()}
    </div>
  );
}
