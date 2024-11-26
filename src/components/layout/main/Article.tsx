"use client";

import { FetchedItem, StoredItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const Article = <T extends FetchedItem | StoredItem>({
  item,
  onSubmit,
  displayTags = true,
}: {
  item: T;
  onSubmit: (item: T) => Promise<null | undefined>;
  displayTags?: boolean;
}) => {
  const router = useRouter();
  const handleClick = async (item: T) => {
    await onSubmit(item);
    router.refresh();
  };
  return (
    <div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick(item)}
        className="visited:text-gray-400 hover:underline transition-colors block"
      >
        {item.title}
      </a>
      {item.tags && displayTags && (
        <div className="flex gap-x-2 flex-wrap my-1">
          {item.tags.map((tag) => (
            <div key={tag.name} className="border border-lime-300 rounded-lg bg-lime-50 px-3 my-1">
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
