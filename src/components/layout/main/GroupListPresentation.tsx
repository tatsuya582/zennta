import { type groupByUser } from "@/types/databaseCustom.types";
import Link from "next/link";

export const GroupListPresentation = ({ groups }: { groups: groupByUser[] }) => {
  return (
    <div className="w-full mt-12" data-testid="favorite-group">
      <div className="flex justify-center items-center mt-8 mb-4">
        <h2>お気に入りグループ</h2>
      </div>

      <div className="mt-4 md:border border-y md:rounded-lg rounded-none p-2 border-gray-300">
        {groups.map((item, index) => {
          return (
            <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
              <div className="flex md:flex-row flex-col justify-between gap-1" data-testid={`group-${index + 1}`}>
                <div className="flex flex-col justify-center w-full">
                  <div>
                    <Link
                      href={`/favorite/${item.id}`}
                      className="visited:text-gray-400 hover:underline transition-colors block"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
