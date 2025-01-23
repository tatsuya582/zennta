import { getFavoriteGroupAndArticles, getFavoriteGroup } from "@/actions/group";
import { getUser } from "@/actions/user";
import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { GroupArticleList } from "@/components/layout/group/GroupArticleList";
import { LinkButtonWrapper } from "@/components/layout/button/LinkButtonWrapper";
import { LinkButton } from "@/components/layout/button/LinkButton";
import { Suspense } from "react";
import { redirect } from "next/navigation";
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
      <LinkButtonWrapper>
        {user.id === group.userId && <LinkButton href={`/favorite/${id}/edit`}>編集</LinkButton>}
        <LinkButton href="/favorite">戻る</LinkButton>
      </LinkButtonWrapper>
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
