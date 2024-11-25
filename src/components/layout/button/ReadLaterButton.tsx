import { addreadLater, deleteReadLater } from "@/actions/readLater";
import { Button } from "@/components/ui/button";
import { QiitaItem, ZennItem } from "@/types/types";
import { revalidatePath } from "next/cache";

export const ReadLaterButton = ({
  item,
  readLaterUrls,
}: {
  item: QiitaItem | ZennItem;
  readLaterUrls: Map<string | undefined, string | undefined>;
}) => {
  const isQiitaItem = (item: QiitaItem | ZennItem): item is QiitaItem => {
    return "url" in item;
  };
  const url = isQiitaItem(item) ? item.url : `https://zenn.dev${item.path}`;
  const id = readLaterUrls.get(url);
  const isReadLater = readLaterUrls.has(url);
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
      await addreadLater(item);
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
