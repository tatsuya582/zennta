import { getFavoriteGroupByUser } from "@/actions/group";
import { GroupListPresentation } from "@/components/layout/main/GroupListPresentation";

export const GroupList = async ({}: {}) => {
  const groups = await getFavoriteGroupByUser();

  if (!groups || groups.length === 0) {
    return;
  }

  return <GroupListPresentation groups={groups} />;
};
