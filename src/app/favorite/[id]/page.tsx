import { getFavoriteGroup, getFavoriteGroupTitle } from "@/actions/group";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { GroupArticleList } from "@/components/layout/group/GroupArticleList";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const title = (await getFavoriteGroupTitle(params.id)) || "無題";

  return {
    title,
  };
}

export default async function FavoriteGroupPage({ params }: { params: { id: string } }) {
  const articles = await getFavoriteGroup(params.id);
  const title = await getFavoriteGroupTitle(params.id);

  if (!title) {
    redirect("/favorite");
  }
  return (
    <>
      <div className="flex justify-end md:mt-0 mt-4">
        <Button variant="outline">
          <Link href="/favorite">戻る</Link>
        </Button>
      </div>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>{title}</h2>
        {articles && articles.length !== 0 && (
          <div
            className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300"
            data-testid="favorite-group"
          >
            <Suspense fallback={<ArticleListSkeleton />}>
              <GroupArticleList articles={articles} />
            </Suspense>
          </div>
        )}
      </div>
    </>
  );
}
