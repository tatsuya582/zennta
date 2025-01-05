"use client";

import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export const AddArticleForm = ({ addAction }: { addAction: (url: string) => Promise<string | undefined> }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!url) return;
    try {
      setIsLoading(true);
      const message = await addAction(url);
      router.refresh();
      toast({
        description: message,
      });
    } catch {
    } finally {
      setUrl("");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-2 mb-4" data-testid="add-article-form">
      <form onSubmit={handleSubmit} role="form" className="flex gap-2 md:w-9/12 w-full mx-2 max-w-screen-sm">
        <Input
          type="text"
          name="url"
          placeholder="追加したいURLを入力"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div>
          <LoadingButton isLoading={isLoading} loadingMx="mx-1">
            追加
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
