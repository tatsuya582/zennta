import { getFavoriteEditGroup, getFavoriteGroupTitle } from "@/actions/group";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { EditGroup } from "@/components/layout/group/EditGroup";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const title = (await getFavoriteGroupTitle(params.id)) || "無題";

  return {
    title: `${title} 編集`,
  };
}

export default async function FavoriteGroupEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const articles = (await getFavoriteEditGroup(id)) || [];
  const title = await getFavoriteGroupTitle(id);

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
        <Suspense fallback={<h2></h2>}>
          <h2>{title} 編集</h2>
        </Suspense>
        <div className="w-full" data-testid="favorite-group">
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <EditGroup initArticles={articles} initTitle={title} editGroupId={id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
