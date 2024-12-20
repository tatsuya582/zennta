"use client";

import { type FetchedArticles } from "@/types/databaseCustom.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useFavoriteMemoForm } from "@/components/layout/form/useFavoriteMemoForm";
import { LoadingButton } from "@/components/layout/button/LoadingButton";

export const AddFavoriteColumnButton = ({ item, isEdit = false }: { item: FetchedArticles; isEdit?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { form, onSubmit, isLoading } = useFavoriteMemoForm(item.column_id, item.memo || "", setIsOpen, isEdit);
  return (
    <div key={item.column_id} className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            メモを{isEdit ? "編集" : "追加"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>メモを入力してください</DialogTitle>
            <DialogDescription>280文字まで入力できます。</DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} className="h-36" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex md:flex-row-reverse flex-col gap-2 mt-4 ">
                  <div className="md:w-1/3 w-full">
                    <LoadingButton isLoading={isLoading} loadingMx="mx-1">
                      {isEdit ? "編集" : "追加"}
                    </LoadingButton>
                  </div>
                  <DialogClose className="mt-0 border" asChild>
                    <Button type="button" variant="outline">
                      キャンセル
                    </Button>
                  </DialogClose>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
