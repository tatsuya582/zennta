import { getFavoriteGroupIsPublished, getPublishGroupTotalPage } from "@/actions/group";
import { GroupListPresentation } from "@/components/layout/main/GroupListPresentation";
import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { LessPagiNation } from "@/components/layout/pagiNation/LessPagiNation";
import { PagiNation } from "@/components/layout/pagiNation/PagiNation";

export const GroupList = async ({ page, buildHref }: { page: number; buildHref: (pageNumber: number) => string }) => {
  const [groups, totalPage] = await Promise.all([getFavoriteGroupIsPublished(page), getPublishGroupTotalPage()]);

  if (!groups || groups.length === 0 || !totalPage) {
    return <NotArticleError isGroup />;
  }

  const pagination =
    totalPage <= 5 ? (
      <LessPagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
    ) : (
      <PagiNation currentPage={page} totalPage={totalPage} buildHref={buildHref} />
    );

  return <GroupListPresentation groups={groups} pagination={pagination} isOtherUser />;
};
