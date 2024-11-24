import { getReadLaterArticles } from "@/actions/readLater";
import { StoredReadLaterButton } from "@/components/layout/button/StoredReadLaterButton";
import NotArticleError from "@/components/layout/main/NotArticleError";
import PagiNation from "@/components/layout/main/PagiNation";
import { Article } from "@/components/layout/readLater/Article";
import { Button } from "@/components/ui/button";

export default async function ReadLsterArticleList({ page }: { page: number }) {
  const articles = await getReadLaterArticles(page);

  if (!articles) {
    return <NotArticleError />;
  }

  const totalPage = 1;
  return (
    <div className="mt-4">
      <div className="border-b border-gray-300 mb-2 pb-4">
        {/* <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" /> */}
      </div>
      {articles.map((item) => {
        return (
          <div key={item.articles.id} className="border-b border-gray-300 m-2 pb-1">
            <div className="flex md:flex-row flex-col justify-between gap-1">
              <Article item={item.articles} />
              <div className="flex items-center gap-2">
                <StoredReadLaterButton item={item.articles} />
                <Button className="flex-1">お気に入り</Button>
              </div>
            </div>
          </div>
        );
      })}
      {/* <PagiNation qiitaPage={qiitaCurrentPage} zennPage={zennCurrentPage} totalPage={totalPage} currentSite="Qiita" /> */}
    </div>
  );
}
