import { getArticles } from "@/actions/article";
import { addHistory } from "@/actions/history";
import { getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/pagiNation/PagiNation";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";

export default async function ArticleList({
  currentPage,
  otherPage,
  currentSite,
}: {
  currentPage: string;
  otherPage: string;
  currentSite: "Qiita" | "Zenn";
}) {
  const fetchResult = await getArticles(currentPage, currentSite);
  if (!fetchResult || fetchResult.articles.length === 0) {
    return <NotArticleError />;
  }
  const articles = fetchResult.articles;
  const readLaterRange = getArticleDateRange(articles);
  const readLaterUrls =
    readLaterRange.start && readLaterRange.end
      ? await getReadLater(readLaterRange.start, readLaterRange.end)
      : new Map();
  const qiitaCurrentPage = currentSite === "Qiita" ? parseInt(currentPage) : parseInt(otherPage);
  const zennCurrentPage = currentSite === "Zenn" ? parseInt(currentPage) : parseInt(otherPage);
  const totalPage = 100;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <PagiNation
          qiitaPage={qiitaCurrentPage}
          zennPage={zennCurrentPage}
          totalPage={totalPage}
          currentSite={currentSite}
        />
      </div>
      {articles.map((item) => (
        <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
          <div className="flex md:flex-row flex-col justify-between gap-1">
            <Article item={item} onSubmit={addHistory} />
            <div className="flex items-center gap-2">
              <ReadLaterButton item={item} readLaterUrls={readLaterUrls} />
              <Button className="flex-1">お気に入り</Button>
            </div>
          </div>
        </div>
      ))}
      <PagiNation
        qiitaPage={qiitaCurrentPage}
        zennPage={zennCurrentPage}
        totalPage={totalPage}
        currentSite={currentSite}
      />
    </div>
  );
}
