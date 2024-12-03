"use client";

import { FetchedItem, StoredItem } from "@/types/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Article = <T extends FetchedItem | StoredItem>({
  item,
  onSubmit,
  displayTags = true,
}: {
  item: T;
  onSubmit: (item: T) => Promise<void>;
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
            <div
              key={tag.name}
              className="border border-lime-300 rounded-lg bg-lime-50 hover:bg-lime-100 px-3 py-[2px] my-1"
            >
              <Link href={`/search?query=${tag.name}`} prefetch={false}>
                {tag.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
