import { Metadata } from "next";

export const metadata: Metadata = {
  title: "お気に入りグループ",
};

export default function FavoriteGroupPage({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>お気に入りグループ</h2>
        <div className="w-full">{params.id}</div>
      </div>
    </>
  );
}
