import { getFavoriteEditGroup, getFavoriteGroup } from "@/actions/group";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { EditGroup } from "@/components/layout/group/EditGroup";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const group = await getFavoriteGroup(params.id);

  return {
    title: `${group?.title} 編集`,
  };
}

export default async function FavoriteGroupEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [articles, group] = await Promise.all([
    getFavoriteEditGroup(id).then((result) => result || []),
    getFavoriteGroup(id),
  ]);

  if (!group) {
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
        <Suspense fallback={<h2></h2>}>
          <h2>{group.title} 編集</h2>
        </Suspense>
        <div className="w-full" data-testid="favorite-group">
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <EditGroup initArticles={articles} initTitle={group.title} editGroupId={id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
