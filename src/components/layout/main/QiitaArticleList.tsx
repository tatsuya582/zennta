import { getQiitaArticles } from "@/actions/article";
import { getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/main/PagiNation";
import { QiitaArticle } from "@/components/layout/main/QiitaArticle";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";

export default async function QiitaArticleList({ qiitaPage, zennPage }: { qiitaPage: string; zennPage: string }) {
  const qiitaFetch = await getQiitaArticles({ page: qiitaPage });

  if (!qiitaFetch) {
    return <NotArticleError />;
  }
  const qiitaArtcles = qiitaFetch.articles;
  const readLaterRange = getArticleDateRange(qiitaArtcles);
  const readLaterUrls =
    readLaterRange.start && readLaterRange.end
      ? await getReadLater(readLaterRange.start, readLaterRange.end)
      : new Map();

  const qiitaCurrentPage = parseInt(qiitaPage);
  const zennCurrentPage = parseInt(zennPage);
  const totalPage = Math.min(qiitaFetch.totalPage, 100);
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" />
      </div>
      {qiitaArtcles.map((item) => {
        return (
          <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
            <div className="flex md:flex-row flex-col justify-between gap-1">
              <QiitaArticle item={item} />
              <div className="flex items-center gap-2">
                <ReadLaterButton item={item} readLaterUrls={readLaterUrls} />
                <Button className="flex-1">お気に入り</Button>
              </div>
            </div>
          </div>
        );
      })}
      <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" />
    </div>
  );
}
