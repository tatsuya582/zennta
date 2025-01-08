"use client";

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
import { deleteFavorite, updateFavoriteColumn } from "@/actions/favorite";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/layout/button/LoadingButton";

export const FavoritePageDeleteButton = ({ item, isMemo = false }: { item: FetchedArticles; isMemo?: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const onSubmitDelete = async () => {
    try {
      setIsLoading(true);
      if (isMemo) {
        await updateFavoriteColumn(item.column_id, "");
      } else {
        await deleteFavorite(item.column_id);
      }
      router.refresh();
      toast({
        description: "削除しました",
      });
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div key={item.id}>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {isMemo && "メモを"}削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isMemo ? "メモ" : "お気に入り"}を削除</AlertDialogTitle>
            <AlertDialogDescription>削除してよろしいですか？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <div>
              <LoadingButton isLoading={isLoading} loadingMx="mx-1" onSubmit={onSubmitDelete}>
                削除
              </LoadingButton>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
