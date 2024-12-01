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

export const FavoritePageDeleteButton = ({ item, isMemo = false }: { item: FetchedArticles; isMemo?: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const onSubmitDelete = async () => {
    try {
      setIsLoading(true);
      if (isMemo) {
        await updateFavoriteColumn(item.favorite_id, "");
      } else {
        await deleteFavorite(item.id);
      }
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
              {isLoading ? (
                <Button className="w-full" disabled>
                  <span className="loader mx-1"></span>
                </Button>
              ) : (
                <Button onClick={onSubmitDelete} className="w-full">
                  削除
                </Button>
              )}
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
