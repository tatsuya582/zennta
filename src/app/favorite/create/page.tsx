import { CreateGroup } from "@/components/layout/group/CreateGroup";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "お気に入りグループ作成",
};

export default function FavoriteGroupCreatePage() {
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
          <Suspense fallback={<ZennArticleListSkeleton />}>
            <CreateGroup />
          </Suspense>
        </div>
      </div>
    </>
  );
}
