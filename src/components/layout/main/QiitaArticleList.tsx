import { getQiitaArticles } from "@/actions/article";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/main/PagiNation";

export default async function QiitaArticleList({ qiitaPage, zennPage }: { qiitaPage: string; zennPage: string }) {
  const qiitaFetch = await getQiitaArticles({ page: qiitaPage });

  if (!qiitaFetch) {
    return <NotArticleError />;
  }
  const qiitaArtcles = qiitaFetch.articles;
  const qiitaCurrentPage = parseInt(qiitaPage);
  const zennCurrentPage = parseInt(zennPage);
  const totalPage = Math.min(qiitaFetch.totalPage, 100);
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" />
      </div>
      {qiitaArtcles.map((item) => (
        <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="visited:text-gray-400 hover:underline transition-colors"
          >
            {item.title}
          </a>
          <div className="flex gap-2 flex-wrap my-2">
            {item.tags.map((tag) => (
              <div key={tag.name} className="border border-lime-300 rounded-lg bg-lime-50 px-3">{tag.name}</div>
            ))}
          </div>
        </div>
      ))}
      <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" />
    </div>
  );
}
