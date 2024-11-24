import { getZennArticles } from "@/actions/article";
import { getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/main/PagiNation";
import { ZennArticle } from "@/components/layout/main/ZennArticle";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";

export default async function ZennArticleList({ qiitaPage, zennPage }: { qiitaPage: string; zennPage: string }) {
  const zennFetch = await getZennArticles({ page: zennPage });
  if (!zennFetch || zennFetch.articles.length === 0) {
    return <NotArticleError />;
  }
  const zennArticles = zennFetch.articles;
  const readLaterRange = getArticleDateRange(zennArticles);
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
        <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Zenn" />
      </div>
      {zennArticles.map((item) => (
        <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
          <div className="flex md:flex-row flex-col justify-between gap-1">
            <ZennArticle item={item} />
            <div className="flex items-center gap-2">
              <ReadLaterButton item={item} readLaterUrls={readLaterUrls} />
              <Button className="flex-1">お気に入り</Button>
            </div>
          </div>
        </div>
      ))}
      <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Zenn" />
    </div>
  );
}
