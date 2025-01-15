"use client";

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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/layout/button/LoadingButton";

export const FavoritePageDeleteButton = ({
  id,
  actions,
  children,
  dialogTitle,
}: {
  id: string;
  actions: (id: string) => Promise<void>;
  children: React.ReactNode;
  dialogTitle: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const onSubmitDelete = async () => {
    try {
      setIsLoading(true);
      await actions(id);
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
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full">
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTitle}を削除</AlertDialogTitle>
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
