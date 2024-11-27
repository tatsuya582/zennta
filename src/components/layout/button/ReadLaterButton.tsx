import { deleteReadLater } from "@/actions/readLater";
import { Button } from "@/components/ui/button";
import { type StoredItem, type FetchedItem } from "@/types/types";
import { revalidatePath } from "next/cache";

export const ReadLaterButton = <T extends FetchedItem | StoredItem>({
  item,
  readLaterUrls,
  onSubmit,
}: {
  item: T;
  readLaterUrls: Map<string | undefined, string | undefined>;
  onSubmit: (item: T) => Promise<null | undefined>;
}) => {
  const id = "created_at" in item ? readLaterUrls.get(item.url) : item.id;
  const isReadLater = readLaterUrls.has(item.url);
  const onSubmitDelete = async () => {
    "use server";
    try {
      if (id) {
        await deleteReadLater(id);
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
      {isReadLater ? (
        <form action={onSubmitDelete}>
          <Button variant="outline" className="w-full">
            登録済み
          </Button>
        </form>
      ) : (
        <form action={onSubmitAdd}>
          <Button variant="outline" className="w-full">
            後で読む
          </Button>
        </form>
      )}
    </div>
  );
};
