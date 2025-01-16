import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { useCreateGroupForm } from "@/components/layout/form/useCreateGroupForm";
import { type groupArticle } from "@/types/types";
import { type FavoriteGroup } from "@/types/databaseCustom.types";

export const CreateGroupForm = ({
  selectedArticles,
  initArticles,
  group = undefined,
}: {
  selectedArticles: groupArticle[];
  initArticles: groupArticle[];
  group?: FavoriteGroup;
}) => {
  const { form, onSubmit, isLoading } = useCreateGroupForm(selectedArticles, initArticles, group);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-2 flex gap-2 items-center">
        <div className="w-full">
          <FormField
            control={form.control}
            name="title"
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
          {group && (
            <>
              <div>
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem className="text-left w-full">
                      <FormLabel>ユーザー名</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ユーザー名" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="text-center w-full my-4 space-x-2">
                    <FormControl>
                      <Checkbox
                        id="isPublished"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked as boolean)}
                      />
                    </FormControl>
                    <FormLabel htmlFor="isPublished" className="font-medium">
                      公開する
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <div className="w-[62px] ml-auto">
          <LoadingButton isLoading={isLoading} loadingMx="">
            {group ? "編集" : "作成"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
