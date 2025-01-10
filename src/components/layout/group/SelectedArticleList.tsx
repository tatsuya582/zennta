import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateGroupForm } from "@/components/layout/form/useCreateGroupForm";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { type FetchedArticles } from "@/types/databaseCustom.types";
import { type Dispatch, type SetStateAction } from "react";

export const SelectedArticleList = ({
  selectedArticles,
  setArticles,
  setSelectedArticles,
}: {
  selectedArticles: FetchedArticles[];
  setArticles: Dispatch<SetStateAction<FetchedArticles[]>>;
  setSelectedArticles: Dispatch<SetStateAction<FetchedArticles[]>>;
}) => {
  const { form, onSubmit, isLoading } = useCreateGroupForm("", selectedArticles);
  const removeGroup = (article: FetchedArticles) => {
    setSelectedArticles((prev) => prev.filter((item) => item.id !== article.id));
    setArticles((prev) => {
      if (prev.some((item) => item.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };
  return (
    <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
      <div className="text-center pb-4 py-2 border-b border-gray-300">
        <h3>選択中の記事</h3>
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
                作成
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>

      {selectedArticles.length === 0 && <div className="h-16 flex items-center">記事が選択されていません</div>}
      {selectedArticles.map((item) => (
        <div key={item.id} className="w-full flex justify-between items-center py-1 border-b border-gray-300">
          <div>{item.title}</div>
          <Button variant="outline" onClick={() => removeGroup(item)}>
            削除
          </Button>
        </div>
      ))}
    </div>
  );
};
