import { addFavoriteGroup } from "@/actions/group";
import { useToast } from "@/hooks/use-toast";
import { groupArticle } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().max(40, {
    message: "メモは40文字以下にしてください",
  }),
});

type useCreateGroupFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading: boolean;
};

export const useCreateGroupForm = (
  initialName: string,
  articles: groupArticle[],
  initialArticles = [],
  isEdit = false
): useCreateGroupFormProps => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toastStr = isEdit ? "お気に入りグループを編集しました" : "お気に入りグループを作成しました";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit && initialName === values.name && initialArticles === articles) {
        return;
      }
      const name = values.name || "無題";
      setIsLoading(true);
      const groupId = await addFavoriteGroup(articles, name);
      toast({
        description: toastStr,
      });
      router.push(`/favorite/${groupId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
};
