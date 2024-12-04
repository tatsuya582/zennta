"use client";

import { deleteReadLater } from "@/actions/readLater";
import { type FetchedArticles } from "@/types/databaseCustom.types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { addStoredFavorite, deleteFavorite } from "@/actions/favorite";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ActionButton } from "@/components/layout/button/ActionButton";
import LoadingButton from "@/components/layout/button/LoadingButton";

export const ReadLaterPageButton = ({ item }: { item: FetchedArticles }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [favoriteId, setFavoriteId] = useState(item.other_column_id);
  const { toast } = useToast();
  let fetchFavoriteId: string | undefined;
  const onSubmitDelete = async () => {
    try {
      setIsLoading(true);
      await deleteReadLater(item.column_id);
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        description: "削除しました",
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitAdd = async () => {
    try {
      setIsFavoriteLoading(true);
      fetchFavoriteId = await addStoredFavorite(item);
      if (fetchFavoriteId) {
        console.log("setFavoriteId:", fetchFavoriteId);
        setFavoriteId(fetchFavoriteId);
      }
      router.refresh();
      toast({
        description: "お気に入り登録しました",
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <div key={item.id} className="flex-1">
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
              <div className="flex flex-col-reverse md:flex-row gap-2 justify-around w-full items-end">
                <AlertDialogCancel className="mt-0 w-full">キャンセル</AlertDialogCancel>
                {item.is_in_other_table ? (
                  <LoadingButton isLoading={isLoading} loadingMx="mx-1" onSubmit={onSubmitDelete}>
                    削除
                  </LoadingButton>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <LoadingButton isLoading={isFavoriteLoading} loadingMx="mx-[39px]" onSubmit={onSubmitAdd}>
                      お気に入り登録
                    </LoadingButton>
                    <LoadingButton isLoading={isLoading} loadingMx="mx-1" onSubmit={onSubmitDelete}>
                      削除
                    </LoadingButton>
                  </div>
                )}
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ActionButton
        item={item}
        id={favoriteId}
        isTable={item.is_in_other_table}
        tableName="favorite"
        deleteAction={deleteFavorite}
        addAction={addStoredFavorite}
        key={favoriteId}
      />
    </div>
  );
};
