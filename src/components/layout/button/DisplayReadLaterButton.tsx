import { deleteReadLater } from "@/actions/readLater";
import { DisplayItem } from "@/types/types";
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

export const DisplayReadLaterButton = ({ item }: { item: DisplayItem }) => {
  const onSubmitDelete = async () => {
    "use server";
    try {
      await deleteReadLater(item.id);
      revalidatePath("/readlater");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div key={item.id} className="flex-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full">読了</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>読み終わりましたか？</AlertDialogTitle>
            <AlertDialogDescription>削除するか、お気に入りに登録するか選択してください</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <div className="flex md:flex-row flex-col gap-2">
              <form action={onSubmitDelete}>
                <AlertDialogAction type="submit" className="w-full">
                  削除
                </AlertDialogAction>
              </form>
              <form>
                <AlertDialogAction type="submit" className="w-full">
                  お気に入り登録
                </AlertDialogAction>
              </form>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
