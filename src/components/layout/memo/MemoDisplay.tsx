import { updateFavoriteColumn } from "@/actions/favorite";
import { FavoritePageDeleteButton } from "@/components/layout/button/FavoritePageDeleteButton";
import { type FetchedArticles } from "@/types/databaseCustom.types";

export const MemoDisplay = ({
  item,
  displayDeleteButton = true,
}: {
  item: FetchedArticles;
  displayDeleteButton?: boolean;
}) => {
  return (
    <div className="flex justify-start w-full ml-4 my-2">
      <div className="w-11/12 border rounded-lg border-gray-300 px-4 py-2" style={{ whiteSpace: "pre-wrap" }}>
        <div>{item.memo}</div>
        <div className="flex justify-end gap-2">
          {displayDeleteButton && (
            <FavoritePageDeleteButton id={item.column_id} actions={updateFavoriteColumn} dialogTitle="メモ">
              メモを削除
            </FavoritePageDeleteButton>
          )}
        </div>
      </div>
    </div>
  );
};
