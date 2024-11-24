import { searchZennArticles } from "@/actions/article";
import { getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import NotArticleError from "@/components/layout/main/NotArticleError";
import { ZennArticle } from "@/components/layout/main/ZennArticle";
import ZennSearchPagiNation from "@/components/layout/search/ZennSearchPagiNation";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";

export default async function ZennArticleSearch({
  query,
  qiitaPage,
  zennPage,
}: {
  query: string;
  qiitaPage: string;
  zennPage: string;
}) {
  const zennFetch = await searchZennArticles({ page: zennPage, query });
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
  const next = zennFetch.next_page;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <ZennSearchPagiNation query={query} qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} next={next} />
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
      <ZennSearchPagiNation query={query} qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} next={next} />
    </div>
  );
}
