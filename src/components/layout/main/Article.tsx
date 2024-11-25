"use client";

import { QiitaItem, type ZennItem } from "@/types/types";
import { useRouter } from "next/navigation";

export const Article = ({
  item,
  onSubmit,
}: {
  item: ZennItem | QiitaItem;
  onSubmit: (item: ZennItem | QiitaItem) => Promise<null | undefined>;
}) => {
  const router = useRouter();
  const isQiitaItem = (item: QiitaItem | ZennItem): item is QiitaItem => {
    return "url" in item;
  };
  const url = isQiitaItem(item) ? item.url : `https://zenn.dev${item.path}`;
  const handleClick = async (item: ZennItem | QiitaItem) => {
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
      {isQiitaItem(item) && (
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
