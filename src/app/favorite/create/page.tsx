import { getFavoriteArticles } from "@/actions/favorite";
import { CreateGroupPage } from "@/components/layout/group/CreateGroup";
import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お気に入りグループ作成",
};

export default async function FavoriteGroupCreatePage() {
  const fetchResult = await getFavoriteArticles(1, undefined);
  const articles = fetchResult?.articles;

  if (!articles || articles.length === 0) {
    return <NotArticleError />;
  }
  return (
    <>
      <div className="flex justify-end md:mt-0 mt-4">
        <Button variant="outline">
          <Link href="/favorite">戻る</Link>
        </Button>
      </div>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>お気に入りグループ作成</h2>
        <div className="w-full">
          <CreateGroupPage initArticles={articles} initTotalPage={fetchResult.totalPage} />
        </div>
      </div>
    </>
  );
}
