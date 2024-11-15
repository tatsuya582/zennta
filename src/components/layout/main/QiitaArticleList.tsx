import { getQiitaArticles } from "@/actions/article";
import PagiNation from "@/components/layout/main/PagiNation";

export default async function QiitaArticleList({ qiitaPage, zennPage }: { qiitaPage: string; zennPage: string }) {
  const qiitaFetch = await getQiitaArticles({ page: qiitaPage });
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
        <div key={item.id} className="border-b border-gray-300 mb-2 mx-2 pb-1">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="visited:text-gray-400 hover:underline transition-colors"
          >
            {item.title}
          </a>
          <div className="flex gap-2 flex-wrap">
            {item.tags.map((tag) => (
              <p key={tag.name}>{tag.name}</p>
            ))}
          </div>
        </div>
      ))}
      <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" />
    </div>
  );
}
