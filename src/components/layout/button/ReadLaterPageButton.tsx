import { deleteReadLater } from "@/actions/readLater";
import { type FetchedArticles } from "@/types/databaseCustom.types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { revalidatePath } from "next/cache";
import { addStoredFavorite } from "@/actions/favorite";

export const ReadLaterPageButton = ({ item }: { item: FetchedArticles }) => {
  const onSubmitDelete = async () => {
    "use server";
    try {
      await deleteReadLater(item.column_id);
      revalidatePath("/readlater");
    } catch (error) {
      console.error(error);
    }
  };
  const onSubmitAdd = async () => {
    "use server";
    try {
      await addStoredFavorite(item);
      revalidatePath("/readlater");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div key={item.id} className="flex-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full">
            読了
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>読み終わりましたか？</AlertDialogTitle>
            <AlertDialogDescription>削除するか、お気に入りに登録するか選択してください</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            {item.is_in_other_table ? (
              <div>
                <form action={onSubmitDelete}>
                  <AlertDialogAction type="submit" className="w-full">
                    削除
                  </AlertDialogAction>
                </form>
              </div>
            ) : (
              <div className="flex md:flex-row flex-col gap-2">
                <form action={onSubmitDelete}>
                  <AlertDialogAction type="submit" className="w-full">
                    削除
                  </AlertDialogAction>
                </form>
                <form action={onSubmitAdd}>
                  <AlertDialogAction type="submit" className="w-full">
                    お気に入り登録
                  </AlertDialogAction>
                </form>
              </div>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
