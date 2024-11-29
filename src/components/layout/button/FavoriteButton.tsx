import { deleteFavorite } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { type StoredItem, type FetchedItem } from "@/types/types";
import { revalidatePath } from "next/cache";

export const FavoriteButton = <T extends FetchedItem | StoredItem>({
  item,
  favoriteUrls,
  onSubmit,
}: {
  item: T;
  favoriteUrls: Map<string | undefined, string | undefined>;
  onSubmit: (item: T) => Promise<void>;
}) => {
  const id = "created_at" in item ? favoriteUrls.get(item.url) : item.id;
  const isFavorite = favoriteUrls.has(item.url);
  const onSubmitDelete = async () => {
    "use server";
    try {
      if (id) {
        await deleteFavorite(id);
        revalidatePath("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmitAdd = async () => {
    "use server";
    try {
      await onSubmit(item);
      revalidatePath("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex-1">
      {isFavorite ? (
        <form action={onSubmitDelete}>
          <Button variant="outline" className="w-full px-[30px]">
            お気に入り
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
