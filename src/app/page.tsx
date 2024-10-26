export default function Home() {
  return (
    <div className="w-full md:ml-auto md:w-3/4 md:p-12 p-4 md:mt-24 mt-12">
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8">
        <h2>Qiita一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">List</div>
      </div>

      <div className="w-full flex justify-center items-center flex-col mt-8">
        <h2>Zenn一覧</h2>
        <div className="w-full border rounded-lg p-2 mt-2 border-gray-300">List</div>
      </div>
    </div>
  );
}
