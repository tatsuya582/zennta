import { FavoritePageDeleteButton } from "@/components/layout/button/FavoritePageDeleteButton";
import { type FetchedArticles } from "@/types/databaseCustom.types";

export const MemoDisplay = ({ item }: { item: FetchedArticles }) => {
  return (
    <div className="flex justify-start w-full ml-4 my-2">
      <div className="w-11/12 border rounded-lg border-gray-300 px-4 py-2" style={{ whiteSpace: "pre-wrap" }}>
        <div>{item.memo}</div>
        <div className="flex justify-end gap-2">
          <FavoritePageDeleteButton item={item} isMemo />
        </div>
      </div>
    </div>
  );
};
