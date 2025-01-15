import { addFavoriteGroup, editFavoriteGroup } from "@/actions/group";
import { useToast } from "@/hooks/use-toast";
import { groupArticle } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().max(40, {
    message: "メモは40文字以下にしてください",
  }),
});

export const useCreateGroupForm = (
  initialName: string,
  articles: groupArticle[],
  initialArticles = <groupArticle[]>[],
  editGroupId = ""
) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toastStr = editGroupId ? "お気に入りグループを編集しました" : "お気に入りグループを作成しました";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const name = values.name || "無題";
      if (
        (editGroupId && initialName === name && initialArticles === articles) ||
        (name === "無題" && articles.length === 0)
      ) {
        return;
      }
      setIsLoading(true);
      const groupId = editGroupId
        ? await editFavoriteGroup(articles, name, editGroupId)
        : await addFavoriteGroup(articles, name);
      router.refresh();
      router.push(`/favorite/${groupId}`);
      toast({
        description: toastStr,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({
        description: "エラーが発生しました",
      });
    }
  };

  return { form, onSubmit, isLoading };
};
