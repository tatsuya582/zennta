import { updateFavoriteColumn } from "@/actions/favorite";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  value: z.string().max(280, {
    message: "メモは280文字以下にしてください",
  }),
});

type useFavoriteMemoFormProps = {
  form: UseFormReturn<{
    value: string;
  }>;
  onSubmit: (values: { value: string }) => Promise<void>;
  isLoading: boolean;
};

export const useFavoriteMemoForm = (
  favoriteId: string,
  initialValue: string,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  isEdit: boolean
): useFavoriteMemoFormProps => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: initialValue,
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toastStr = isEdit ? "メモを編集しました" : "メモを追加しました";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialValue === values.value) {
        setIsLoading(false);
        return;
      }
      await updateFavoriteColumn(favoriteId, values.value);
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        description: toastStr,
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
};
