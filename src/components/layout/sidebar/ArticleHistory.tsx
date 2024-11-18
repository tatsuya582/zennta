import { getHistory } from "@/actions/history";
import { CreateArticle } from "@/components/layout/sidebar/CreateArticle";

export const ArticleHistory = async () => {
  const history = await getHistory();
  if (!history) {
    return <div>履歴がありません</div>;
  }
  history.map((item) => {
    console.log(item);
  });
  return (
    <>
      {history.map((item) => (
        <div key={item.articles.id}>
          <CreateArticle item={item.articles} />
        </div>
      ))}
    </>
  );
};
