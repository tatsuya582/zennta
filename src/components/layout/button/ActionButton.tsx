"use client";

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
      {isLoading ? (
        <Button variant="outline" disabled>
          <span className={`loader-outline-button ${className}`}></span>
        </Button>
      ) : isTable ? (
        <Button onClick={onSubmitDelete} variant="outline" className="w-full">
          {deleteLabel}
        </Button>
      ) : (
        <Button onClick={onSubmitAdd} variant="outline" className="w-full">
          {addLabel}
        </Button>
      )}
    </div>
  );
};
