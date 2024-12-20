"use client";

import { useUserForm } from "@/components/layout/form/UserForm/useUserForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NameInputField } from "@/components/layout/form/UserForm/NameInputField";
import { LoadingButton } from "@/components/layout/button/LoadingButton";

export const UserForm = ({ name }: { name: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(name);
  const { form, onSubmit, isLoading } = useUserForm(name, setIsOpen, setDisplayName);

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          名前
        </label>
        <Input value={displayName} disabled />
      </div>
      <div className="flex justify-end mt-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>編集</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>名前を変更しますか？</DialogTitle>
              <DialogDescription>2文字以上50文字以内で入力してください。</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <NameInputField control={form.control} />
                <div className="flex justify-end">
                  <div>
                    <LoadingButton isLoading={isLoading} loadingMx="mx-1">
                      編集
                    </LoadingButton>
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
