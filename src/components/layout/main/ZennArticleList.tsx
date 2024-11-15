import { getZennArticles } from "@/actions/article";
import PagiNation from "@/components/layout/main/PagiNation";

export default async function ZennArticleList({ qiitaPage, zennPage }: { qiitaPage: string; zennPage: string }) {
  const zennFetch = await getZennArticles({ page: zennPage });
  const zennArticles = zennFetch.articles;
  const qiitaCurrentPage = parseInt(qiitaPage);
  const zennCurrentPage = parseInt(zennPage);
  const totalPage = 100;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Zenn" />
      </div>
      {zennArticles.map((item) => (
        <div key={item.id} className="border-b border-gray-300 mb-2 mx-2 pb-1">
          <a
            href={`https://zenn.dev${item.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="visited:text-gray-400 hover:underline transition-colors"
          >
            {item.title}
          </a>
        </div>
      ))}
      <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Zenn" />
    </div>
  );
}
