"use client";

import { addreadLaterQiita } from "@/actions/readLater";
import { Button } from "@/components/ui/button";
import { QiitaItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const QiitaReadLaterButton = ({ item, readLaterUrls }: { item: QiitaItem; readLaterUrls: Set<unknown> }) => {
  const router = useRouter();
  const onSubmit = async (item: QiitaItem) => {
    await addreadLaterQiita(item);
    router.refresh();
  };
  const isReadLater = readLaterUrls.has(item.url);
  return (
    <div>
      {isReadLater ? (
        <Button variant="outline">登録済み</Button>
      ) : (
        <Button variant="outline" onClick={() => onSubmit(item)}>
          後で読む
        </Button>
      )}
    </div>
  );
};
