import { addStoredFavorite, deleteFavorite } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { type StoredItem } from "@/types/types";
import { revalidatePath } from "next/cache";

export const OtherTableButton = ({ item, isOtherTable }: { item: StoredItem; isOtherTable: boolean }) => {
  const onSubmitDelete = async () => {
    "use server";
    try {
      await deleteFavorite(item.id);
      revalidatePath("/");
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmitAdd = async () => {
    "use server";
    try {
      await addStoredFavorite(item);
      revalidatePath("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex-1">
      {isOtherTable ? (
        <form action={onSubmitDelete}>
          <Button variant="outline" className="w-full">
            お気に入り済み
          </Button>
        </form>
      ) : (
        <form action={onSubmitAdd}>
          <Button variant="outline" className="w-full">
            お気に入り登録
          </Button>
        </form>
      )}
    </div>
  );
};
