import { getQiitaArticles } from "@/actions/article";

type qiitaItem = {
  id: string;
  title: string;
  url: string;
  tags: [];
  created_at: string; // ISO 8601 format, e.g., "2000-01-01T00:00:00+00:00"
};

export default async function Home() {
  const qiitaArticles: qiitaItem[] = await getQiitaArticles({ page: "2" });
  qiitaArticles.map((item) => console.log(item.url));
  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">List</div>
      </div>

      <div className="w-full flex justify-center items-center flex-col mt-8">
        <h2>Zenn一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">List</div>
      </div>
    </>
  );
}
