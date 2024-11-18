"use client";

import { addHistoryZenn } from "@/actions/history";
import { type zennItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const ZennArticle = ({ item }: { item: zennItem }) => {
  const router = useRouter();
  const onSubmit = async (item: zennItem) => {
    await addHistoryZenn(item);
    router.refresh();
  };
  return (
    <div>
      <a
        href={`https://zenn.dev${item.path}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onSubmit(item)}
        className="visited:text-gray-400 hover:underline transition-colors block"
      >
        {item.title}
      </a>
    </div>
  );
};
