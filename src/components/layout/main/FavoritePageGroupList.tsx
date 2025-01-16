import { getFavoriteGroupByUser } from "@/actions/group";
import { GroupListPresentation } from "@/components/layout/main/GroupListPresentation";
import { Suspense } from "react";

export const FavoritePageGroupList = async () => {
  const groups = await getFavoriteGroupByUser();

  if (!groups || groups.length === 0) {
    return;
  }

  return (
    <div className="w-full mt-12" data-testid="favorite-group">
      <div className="flex flex-col justify-center items-center mt-8 mb-4">
        <h2>お気に入りグループ</h2>
        <div className="w-full mt-4 md:border border-y md:rounded-lg rounded-none p-2 border-gray-300">
          <Suspense>
            <GroupListPresentation groups={groups} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};
