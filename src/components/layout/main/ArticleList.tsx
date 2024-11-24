import { getArticles } from "@/actions/article";
import { addHistory } from "@/actions/history";
import { getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/main/PagiNation";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";
import { QiitaArticlesResponse, ZennArticlesResponse } from "@/types/types";

export default async function ArticleList({
  qiitaPage,
  zennPage,
  currentSite,
}: {
  qiitaPage: string;
  zennPage: string;
  currentSite: "Qiita" | "Zenn";
}) {
  const dataFetch =
    currentSite === "Qiita"
      ? await getArticles<QiitaArticlesResponse>(qiitaPage, currentSite)
      : await getArticles<ZennArticlesResponse>(zennPage, currentSite);
  if (!dataFetch || dataFetch.articles.length === 0) {
    return <NotArticleError />;
  }
  const articles = dataFetch.articles;
  const readLaterRange = getArticleDateRange(articles);
  const readLaterUrls =
    readLaterRange.start && readLaterRange.end
      ? await getReadLater(readLaterRange.start, readLaterRange.end)
      : new Map();
  const qiitaCurrentPage = parseInt(qiitaPage);
  const zennCurrentPage = parseInt(zennPage);
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
