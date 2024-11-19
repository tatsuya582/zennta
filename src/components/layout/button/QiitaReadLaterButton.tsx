"use client";

import { addreadLaterQiita } from "@/actions/readLater";
import { Button } from "@/components/ui/button";
import { QiitaItem } from "@/types/types";
import { useState } from "react";

export const QiitaReadLaterButton = ({ item, readLaterUrls }: { item: QiitaItem; readLaterUrls: Set<unknown> }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReadLater, setIsReadLater] = useState(readLaterUrls.has(item.url))
  const onSubmit = async (item: QiitaItem) => {
    try {
      setIsLoading(true)
      await addreadLaterQiita(item);
    } catch (error) {
      console.error(error);
    } finally {
      setIsReadLater(!isReadLater);
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isReadLater ? (
        <div>
          {isLoading ? (
            <Button variant="outline"><span className="loader mx-1"></span></Button>
          ): (
            <Button variant="outline">登録済み</Button>
          )}
        </div>
      ) : (
        <div>
          {isLoading ? (
            <Button variant="outline" onClick={(e) => e.preventDefault()}><span className="loader mx-1"></span></Button>
          ): (
            <Button variant="outline" onClick={() => onSubmit(item)}>後で読む</Button>
          )}
        </div>
      )}
    </div>
  );
};
