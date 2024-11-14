import { getQiitaArticles } from "@/actions/article";
import QiitaPagiNation from "@/components/layout/main/QiitaPagiNation";

export default async function QiitaArticleList({ page }: { page: string }) {
  const qiitaFetch = await getQiitaArticles({ page });
  const qiitaArtcles = qiitaFetch.articles;
  const currentPage = parseInt(page);
  const totalPage = Math.min(qiitaFetch.totalPage, 100);
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <QiitaPagiNation currentPage={currentPage} totalPage={totalPage} />
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
          <div className="flex gap-2">
            {item.tags.map((tag) => (
              <p key={tag.name}>{tag.name}</p>
            ))}
          </div>
        </div>
      ))}
      <QiitaPagiNation currentPage={currentPage} totalPage={totalPage} />
    </div>
  );
}
