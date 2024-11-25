import { searchQiitaArticles } from "@/actions/article";
import { addHistory } from "@/actions/history";
import { getReadLater } from "@/actions/readLater";
import { ReadLaterButton } from "@/components/layout/button/ReadLaterButton";
import { Article } from "@/components/layout/main/Article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import LessSearchPagiNation from "@/components/layout/pagiNation/LessSearchPagiNation";
import SearchPagiNation from "@/components/layout/pagiNation/SearchPagiNation";
import { Button } from "@/components/ui/button";
import { getArticleDateRange } from "@/lib/readLater/getReadLater";

export default async function QiitaArticleSearch({
  query,
  qiitaPage,
  zennPage,
}: {
  query: string;
  qiitaPage: string;
  zennPage: string;
}) {
  const qiitaFetch = await searchQiitaArticles({ page: qiitaPage, query });

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
  const totalPage = Math.min(qiitaFetch?.totalPage ?? 0, 100);
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        {totalPage <= 5 ? (
          <LessSearchPagiNation
            query={query}
            qiitaPage={qiitaCurrentPage}
            zennPage={zennCurrentPage}
            totalPage={totalPage}
          />
        ) : (
          <SearchPagiNation
            query={query}
            qiitaPage={qiitaCurrentPage}
            zennPage={zennCurrentPage}
            totalPage={totalPage}
            currentSite="Qiita"
          />
        )}
      </div>
      {qiitaArtcles.map((item) => (
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
      {totalPage <= 5 ? (
        <LessSearchPagiNation
          query={query}
          qiitaPage={qiitaCurrentPage}
          zennPage={zennCurrentPage}
          totalPage={totalPage}
        />
      ) : (
        <SearchPagiNation
          query={query}
          qiitaPage={qiitaCurrentPage}
          zennPage={zennCurrentPage}
          totalPage={totalPage}
          currentSite="Qiita"
        />
      )}
    </div>
  );
}
