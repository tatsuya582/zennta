import { deleteFavoriteGroup } from "@/actions/group";
import { addStoredItemHistory } from "@/actions/history";
import { FavoritePageDeleteButton } from "@/components/layout/button/FavoritePageDeleteButton";
import { Article } from "@/components/layout/main/Article";
import { Button } from "@/components/ui/button";
import { type groupByUser } from "@/types/databaseCustom.types";
import Link from "next/link";
import clsx from "clsx";

export const GroupListPresentation = ({ groups }: { groups: groupByUser[] }) => {
  return (
    <div className="w-full mt-12" data-testid="favorite-group">
      <div className="flex justify-center items-center mt-8 mb-4">
        <h2>お気に入りグループ</h2>
      </div>

      <div className="mt-4 md:border border-y md:rounded-lg rounded-none p-2 border-gray-300">
        <div className="border-b border-gray-300 m-2 pb-1" />
        {groups.map((item, index) => {
          const buttonColor = item.isPublished ? "blue" : "pink";
          return (
            <div key={item.id} className="border-b border-gray-300 m-2 pb-1">
              <div
                className="flex md:flex-row flex-col justify-between items-center gap-1"
                data-testid={`group-${index + 1}`}
              >
                <div className="w-full flex items-center gap-2">
                  <div
                    className={clsx(
                      "w-[74px] border rounded-lg py-[2px] px-3 whitespace-nowrap text-center",
                      `border-${buttonColor}-300`,
                      `bg-${buttonColor}-50`,
                      `text-${buttonColor}-700`
                    )}
                  >
                    {item.isPublished ? "公開" : "非公開"}
                  </div>
                  <Link
                    href={`/favorite/${item.id}`}
                    className="visited:text-gray-400 hover:underline transition-colors block"
                  >
                    {item.title}
                  </Link>
                </div>
                <div className="md:w-[132px] w-full flex gap-2 md:flex-row flex-col">
                  <Button variant="outline" className="w-full md:w-[62px]">
                    <Link href={`/favorite/${item.id}/edit`}>編集</Link>
                  </Button>
                  <div className="w-full md:w-[62px]">
                    <FavoritePageDeleteButton id={item.id} actions={deleteFavoriteGroup} dialogTitle="グループ">
                      削除
                    </FavoritePageDeleteButton>
                  </div>
                </div>
              </div>
              <div className="w-10/12 mx-auto mt-2">
                {item.articles.map((item) => (
                  <div key={item.id}>
                    <Article item={item} onSubmit={addStoredItemHistory} displayTags={false} isGroup />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
