"use client";

import { addHistoryDisplay } from "@/actions/history";
import { DisplayItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const Article = ({ item }: { item: DisplayItem }) => {
  const router = useRouter();
  const onSubmit = async (item: DisplayItem) => {
    await addHistoryDisplay(item.id);
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
      <div className="flex gap-2 flex-wrap">
        {item.tags?.map((tag) => (
          <div key={tag.name} className="border border-lime-300 rounded-lg bg-lime-50 px-3 my-2">
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};
