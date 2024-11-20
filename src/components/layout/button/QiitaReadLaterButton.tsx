"use client";

import { addreadLaterQiita, deleteReadLater } from "@/actions/readLater";
import { Button } from "@/components/ui/button";
import { QiitaItem } from "@/types/types";
import { useState } from "react";

export const QiitaReadLaterButton = ({
  item,
  readLaterUrls,
}: {
  item: QiitaItem;
  readLaterUrls: Map<string | undefined, string | undefined>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReadLater, setIsReadLater] = useState(readLaterUrls.has(item.url));
  const onSubmitAdd = async (item: QiitaItem) => {
    try {
      setIsLoading(true);
      const articleId = await addreadLaterQiita(item);
      if (articleId) {
        readLaterUrls.set(item.url, articleId);
        setIsReadLater(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitDelete = async (item: QiitaItem) => {
    try {
      setIsLoading(true);
      const articleId = readLaterUrls.get(item.url);
      if (articleId) {
        await deleteReadLater(articleId);
        readLaterUrls.delete(item.url);
        setIsReadLater(false);
      } else {
        console.error("Article ID not found for the URL");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {isReadLater ? (
        <div>
          <Button variant="outline" onClick={() => onSubmitDelete(item)} disabled={isLoading}>
            {isLoading ? <span className="loader mx-5 block"></span> : "登録済み"}
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="outline" onClick={() => onSubmitAdd(item)} disabled={isLoading}>
            {isLoading ? <span className="loader mx-5 block"></span> : "後で読む"}
          </Button>
        </div>
      )}
    </div>
  );
};
