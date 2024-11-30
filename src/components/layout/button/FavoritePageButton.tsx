import { type FetchedArticles } from "@/types/databaseCustom.types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { revalidatePath } from "next/cache";
import { deleteFavorite } from "@/actions/favorite";

export const FavoritePageButton = ({ item }: { item: FetchedArticles }) => {
  const onSubmitDelete = async () => {
    "use server";
    try {
      await deleteFavorite(item.id);
      revalidatePath("/favorite");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div key={item.id} className="flex-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full">
            削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>削除しますか？</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <div>
              <form action={onSubmitDelete}>
                <AlertDialogAction type="submit" className="w-full">
                  削除
                </AlertDialogAction>
              </form>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
