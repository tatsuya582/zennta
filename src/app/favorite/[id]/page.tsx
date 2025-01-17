import { getFavoriteGroupAndArticles, getFavoriteGroup } from "@/actions/group";
import { getUser } from "@/actions/user";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { GroupArticleList } from "@/components/layout/group/GroupArticleList";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const group = await getFavoriteGroup(params.id);

  return {
    title: `${group?.title}`,
  };
}

export default async function FavoriteGroupPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [articles, group, user] = await Promise.all([getFavoriteGroupAndArticles(id), getFavoriteGroup(id), getUser()]);

  if (!group) {
    redirect("/favorite");
  }

  if (!user) {
    redirect("/");
  }
  return (
    <>
      <div className="flex justify-end gap-2 md:mt-0 mt-4">
        {user.id === group.userId && (
          <Button variant="outline">
            <Link href={`/favorite/${id}/edit`}>編集</Link>
          </Button>
        )}
        <Button variant="outline">
          <Link href="/favorite">戻る</Link>
        </Button>
      </div>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <Suspense fallback={<h2></h2>}>
          <h2>{group.title}</h2>
        </Suspense>
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
