"use client";

import LoadingButton from "@/components/layout/button/LoadingButton";
import { Button } from "@/components/ui/button";
import { type StoredItem, type FetchedItem } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ActionButton = <T extends FetchedItem | StoredItem>({
  item,
  id,
  isTable,
  tableName,
  deleteAction,
  addAction,
}: {
  item: T;
  id: string | undefined | null;
  isTable: boolean;
  tableName: "readLater" | "favorite";
  deleteAction: (id: string) => Promise<void>;
  addAction: (item: T) => Promise<string | undefined>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(id);
  const router = useRouter();

  const labels = {
    readLater: {
      addLabel: "後で読む",
      deleteLabel: "登録済み",
      className: "mx-[18px]",
    },
    favorite: {
      addLabel: "お気に入り登録",
      deleteLabel: "お気に入り済み",
      className: "mx-[39px]",
    },
  };

  const { addLabel, deleteLabel, className } = labels[tableName];
  const onSubmitDelete = async () => {
    try {
      if (deleteId) {
        setIsLoading(true);
        await deleteAction(deleteId);
        router.refresh();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitAdd = async () => {
    try {
      setIsLoading(true);
      setDeleteId(await addAction(item));
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-1">
      {isTable ? (
        <LoadingButton isLoading={isLoading} loadingMx={className} variant="outline" onSubmit={onSubmitDelete}>
          {deleteLabel}
        </LoadingButton>
      ) : (
        <LoadingButton isLoading={isLoading} loadingMx={className} variant="outline" onSubmit={onSubmitAdd}>
          {addLabel}
        </LoadingButton>
      )}
    </div>
  );
};
