"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { link } from "fs";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

export default function UserForm({ name, edit }: { name: string; edit: boolean }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          {edit ? (
            <Button type="submit">編集</Button>
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
