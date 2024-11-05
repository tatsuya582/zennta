"use client";

import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "名前は2文字以上にしてください",
    })
    .max(50, {
      message: "名前は50文字以下にしてください",
    }),
});

export default function UserForm({ name, edit }: { name: string; edit: boolean }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateUser(values.name);
      toast({
        description: "名前を変更しました",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={edit ? form.handleSubmit(onSubmit) : (e) => e.preventDefault()} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input
                  placeholder="名前"
                  {...field}
                  disabled={!edit}
                  className={`border p-2 ${!edit ? "disabled:text-black disabled:opacity-100" : ""}`}
                />
              </FormControl>
              {edit && <FormDescription>名前は2文字以上、50文字以下にしてください</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          {edit ? (
            <div className="flex gap-2">
              <div>
                <Link href="/profile">
                  <Button type="button" variant="outline">
                    戻る
                  </Button>
                </Link>
              </div>
              <div>
                <Button type="submit">編集</Button>
              </div>
            </div>
          ) : (
            <Link href="/profile/edit">
              <Button type="button">編集</Button>
            </Link>
          )}
        </div>
      </form>
    </Form>
  );
}
