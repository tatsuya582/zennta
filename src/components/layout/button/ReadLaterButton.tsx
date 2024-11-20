"use client";

import { addreadLater, deleteReadLater } from "@/actions/readLater";
import { Button } from "@/components/ui/button";
import { QiitaItem, ZennItem } from "@/types/types";
import { useState } from "react";

export const ReadLaterButton = ({
  item,
  readLaterUrls,
}: {
  item: QiitaItem | ZennItem;
  readLaterUrls: Map<string | undefined, string | undefined>;
}) => {
  const isQiitaItem = (item: QiitaItem | ZennItem): item is QiitaItem => {
    return "url" in item;
  }
  const url = isQiitaItem(item) ? item.url : `https://zenn.dev${item.path}`
  const [isLoading, setIsLoading] = useState(false);
  const [isReadLater, setIsReadLater] = useState(readLaterUrls.has(url));
  const onSubmitAdd = async (item: QiitaItem | ZennItem ) => {
    try {
      setIsLoading(true);
      const articleId = await addreadLater(item);
      if (articleId) {
        readLaterUrls.set(url, articleId);
        setIsReadLater(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitDelete = async (item: QiitaItem | ZennItem) => {
    try {
      setIsLoading(true);
      const articleId = readLaterUrls.get(url);
      if (articleId) {
        await deleteReadLater(articleId);
        readLaterUrls.delete(url);
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
