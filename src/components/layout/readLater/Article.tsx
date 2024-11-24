"use client";

import { addStoredItemHistory } from "@/actions/history";
import { StoredItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const Article = ({ item }: { item: StoredItem }) => {
  const router = useRouter();
  const onSubmit = async (item: StoredItem) => {
    await addStoredItemHistory(item.id);
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
      <div className="flex gap-x-2 flex-wrap my-1">
        {item.tags?.map((tag) => (
          <div key={tag.name} className="border border-lime-300 rounded-lg bg-lime-50 px-3 my-1">
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};
