import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateGroupForm } from "@/components/layout/form/useCreateGroupForm";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { type Dispatch, type SetStateAction } from "react";
import { type groupArticle } from "@/types/types";

// setDeleteArticles,initArticles,initTitle,isEdit,isDeleteは編集のときに使う
export const SelectedArticleList = ({
  selectedArticles,
  setArticles,
  setSelectedArticles,
  setDeleteArticles = undefined,
  initArticles = [],
  initTitle = "",
  editGroupId = "",
  isDelete = false,
}: {
  selectedArticles: groupArticle[];
  setArticles: Dispatch<SetStateAction<groupArticle[]>>;
  setSelectedArticles: Dispatch<SetStateAction<groupArticle[]>>;
  setDeleteArticles?: Dispatch<SetStateAction<groupArticle[]>>;
  initArticles?: groupArticle[];
  initTitle?: string;
  editGroupId?: string;
  isDelete?: boolean;
}) => {
  const { form, onSubmit, isLoading } = useCreateGroupForm(initTitle, selectedArticles, initArticles, editGroupId);
  const removeGroup = (article: groupArticle) => {
    setSelectedArticles((prev) => prev.filter((item) => item.favoriteId !== article.favoriteId));

    const updateArticles = (updater: React.Dispatch<React.SetStateAction<groupArticle[]>>) => {
      updater((prev) => {
        if (prev.some((item) => item.favoriteId === article.favoriteId)) {
          return prev;
        }
        return [...prev, article];
      });
    };

    // 編集の時だけsetDeleteArticlesがある
    if (setDeleteArticles) {
      const isInitArticle = initArticles.some((item) => item.favoriteId === article.favoriteId);
      if (isInitArticle) {
        updateArticles(setDeleteArticles);
      } else {
        updateArticles(setArticles);
      }
    } else {
      updateArticles(setArticles);
    }
  };
  return (
    <div
      className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300"
      data-testid={isDelete ? "deleted-artciles" : "selected-articles"}
    >
      <div className="text-center pb-4 py-2 border-b border-gray-300">
        <h3>{isDelete && "削除"}選択中の記事</h3>
        {!isDelete && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 flex gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="text-left w-full">
                    <FormLabel>グループ名</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="グループ名" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-[62px] ml-auto">
                <LoadingButton isLoading={isLoading} loadingMx="">
                  {editGroupId ? "編集" : "作成"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        )}
      </div>
      {selectedArticles.length === 0 && <div className="h-16 flex items-center">記事が選択されていません</div>}
      {selectedArticles.map((item) => (
        <div key={item.favoriteId} className="w-full flex justify-between items-center py-1 border-b border-gray-300">
          <div>{item.title}</div>
          <Button variant="outline" onClick={() => removeGroup(item)}>
            {isDelete ? "選択" : "削除"}
          </Button>
        </div>
      ))}
    </div>
  );
};
