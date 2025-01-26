import { getFavoriteEditGroup, getFavoriteGroup } from "@/actions/group";
import { getUser } from "@/actions/user";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { EditGroup } from "@/components/layout/group/EditGroup";
import { LinkButtonWrapper } from "@/components/layout/button/LinkButtonWrapper";
import { LinkButton } from "@/components/layout/button/LinkButton";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const group = await getFavoriteGroup(params.id);

  return {
    title: `${group?.title} 編集`,
  };
}

export default async function FavoriteGroupEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [articles, group, user] = await Promise.all([
    getFavoriteEditGroup(id).then((result) => result || []),
    getFavoriteGroup(id),
    getUser(),
  ]);

  if (!group) {
    redirect("/favorite");
  }

  if (!user || group.userId !== user.id) {
    redirect("/");
  }
  return (
    <>
      <LinkButtonWrapper>
        <LinkButton href="/favorite">戻る</LinkButton>
      </LinkButtonWrapper>

      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <Suspense fallback={<h2></h2>}>
          <h2>{group.title} 編集</h2>
        </Suspense>
        <div className="w-full" data-testid="favorite-group">
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <EditGroup initArticles={articles} group={group} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
