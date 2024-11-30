import { Button } from "@/components/ui/button";
import { type StoredItem, type FetchedItem } from "@/types/types";
import { revalidatePath } from "next/cache";

export const ActionButton = <T extends FetchedItem | StoredItem>({
  item,
  id,
  isOtherTable,
  addLabel,
  deleteLabel,
  deleteAction,
  addAction,
}: {
  item: T;
  id: string | undefined;
  isOtherTable: boolean;
  addLabel: string;
  deleteLabel: string;
  deleteAction: (id: string) => Promise<void>;
  addAction: (item: T) => Promise<void>;
}) => {
  const onSubmitDelete = async () => {
    "use server";
    try {
      if (id) {
        await deleteAction(id);
        revalidatePath("/");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmitAdd = async () => {
    "use server";
    try {
      await addAction(item);
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
            {deleteLabel}
          </Button>
        </form>
      ) : (
        <form action={onSubmitAdd}>
          <Button variant="outline" className="w-full">
            {addLabel}
          </Button>
        </form>
      )}
    </div>
  );
};
