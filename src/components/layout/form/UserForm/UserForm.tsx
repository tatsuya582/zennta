"use client";

import EditButtons from "@/components/layout/form/UserForm/EditButtons";
import NameInputField from "@/components/layout/form/UserForm/NameInputField";
import { useUserForm } from "@/components/layout/form/UserForm/useUserForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";

export default function UserForm({ name, edit }: { name: string; edit: boolean }) {
  const { form, onSubmit, isLoading } = useUserForm(name);

  return (
    <Form {...form}>
      <form onSubmit={edit ? form.handleSubmit(onSubmit) : (e) => e.preventDefault()} className="space-y-4">
        <NameInputField control={form.control} edit={edit} />
        <div className="flex justify-end">
          {edit ? (
            <EditButtons isLoading={isLoading} />
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
