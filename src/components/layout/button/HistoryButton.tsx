import { addStoredreadLater, deleteReadLater } from "@/actions/readLater";
import { StoredItem } from "@/types/types";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export const HistoryButton = ({
  item,
  readLaterUrls,
}: {
  item: StoredItem;
  readLaterUrls: Map<string | undefined, string | undefined>;
}) => {
  const isReadLater = readLaterUrls.has(item.url);
  const onSubmitDelete = async () => {
    "use server";
    try {
      await deleteReadLater(item.id);
      revalidatePath("/");
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmitAdd = async () => {
    "use server";
    try {
      await addStoredreadLater(item.id);
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
