import { updateFavoriteColumn } from "@/actions/favorite";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  value: z
    .string()
    .min(2, {
      message: "メモは2文字以上にしてください",
    })
    .max(2800, {
      message: "メモは280文字以下にしてください",
    }),
});

export const useFavoriteMemoForm = (favoriteId: string, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await updateFavoriteColumn(favoriteId, values.value);
      router.refresh();
      toast({
        description: "メモを追加しました",
      });
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
};
