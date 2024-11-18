"use client";

import { addHistory } from "@/actions/history";
import { type QiitaItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const QiitaArticle = ({ item }: { item: QiitaItem }) => {
  const router = useRouter();
  const onSubmit = async (item: QiitaItem) => {
    await addHistory(item);
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
      <div className="flex gap-2 flex-wrap my-2">
        {item.tags.map((tag) => (
          <div key={tag.name} className="border border-lime-300 rounded-lg bg-lime-50 px-3">
            {tag.name}
          </div>
        ))}
      </div>
    </div>
  );
};
