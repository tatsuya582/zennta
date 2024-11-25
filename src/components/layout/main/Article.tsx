"use client";

import { QiitaItem, StoredItem, type ZennItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const Article = <T extends ZennItem | QiitaItem | StoredItem>({
  item,
  onSubmit,
}: {
  item: T;
  onSubmit: (item: T) => Promise<null | undefined>;
}) => {
  const router = useRouter();
  const url = "path" in item ? `https://zenn.dev${item.path}` : item.url;
  const handleClick = async (item: T) => {
    await onSubmit(item);
    router.refresh();
  };
  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick(item)}
        className="visited:text-gray-400 hover:underline transition-colors block"
      >
        {item.title}
      </a>
      {"tags" in item && (
        <div className="flex gap-x-2 flex-wrap my-1">
          {item.tags?.map((tag) => (
            <div key={tag.name} className="border border-lime-300 rounded-lg bg-lime-50 px-3 my-1">
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
