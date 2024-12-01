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

export const AddFavoriteColumnButton = ({ item }: { item: FetchedArticles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { form, onSubmit, isLoading } = useFavoriteMemoForm(item.favorite_id, setIsOpen);
  return (
    <div key={item.favorite_id} className="flex-1">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            メモを追加
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
                  {isLoading ? (
                    <div className="md:w-1/3 w-full">
                      <Button type="submit" className="w-full" disabled>
                        <span className="loader mx-1"></span>
                      </Button>
                    </div>
                  ) : (
                    <div className="md:w-1/3 w-full">
                      <Button type="submit" className="w-full">
                        追加
                      </Button>
                    </div>
                  )}
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
