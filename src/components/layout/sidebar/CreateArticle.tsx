"use client";

import { updateHistory } from "@/actions/history";
import { StoredItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const CreateArticle = ({ item }: { item: StoredItem }) => {
  const router = useRouter();
  const onSubmit = async (item: StoredItem) => {
    await updateHistory(item);
    router.refresh();
  };
  return (
    <div>
      <a
        href={item.url}
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
