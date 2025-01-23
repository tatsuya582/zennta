import { LinkButton } from "@/components/layout/button/LinkButton";
import { LinkButtonWrapper } from "@/components/layout/button/LinkButtonWrapper";
import { CreateGroup } from "@/components/layout/group/CreateGroup";
import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "お気に入りグループ作成",
};

export default function FavoriteGroupCreatePage() {
  return (
    <>
      <LinkButtonWrapper>
        <LinkButton href="/favorite">戻る</LinkButton>
      </LinkButtonWrapper>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>お気に入りグループ作成</h2>
        <div className="w-full" data-testid="favorite-group">
          <Suspense
            fallback={
              <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
                <ZennArticleListSkeleton />
              </div>
            }
          >
            <CreateGroup />
          </Suspense>
        </div>
      </div>
    </>
  );
}
