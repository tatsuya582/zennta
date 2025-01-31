import { addFavoriteGroup, editFavoriteGroup } from "@/actions/group";
import { useToast } from "@/hooks/use-toast";
import { FavoriteGroup } from "@/types/databaseCustom.types";
import { groupArticle } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().max(40, {
    message: "メモは40文字以下にしてください",
  }),
  isPublished: z.boolean().optional(),
  userName: z
    .string()
    .min(2, {
      message: "名前は2文字以上にしてください",
    })
    .max(50, {
      message: "名前は50文字以下にしてください",
    }),
});

const initFavoriteGroup = {
  id: "",
  isPublished: false,
  title: "",
  userName: "匿名",
};

export const useCreateGroupForm = (
  articles: groupArticle[],
  initialArticles = <groupArticle[]>[],
  group = <FavoriteGroup>initFavoriteGroup
) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: group.title,
      isPublished: group.isPublished,
      userName: group.userName,
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toastStr = group.id ? "お気に入りグループを編集しました" : "お気に入りグループを作成しました";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const title = values.title || "無題";
      const userName = values.userName || "匿名";
      const isPublished = values.isPublished || false;
      if (
        (group.id &&
          group.title === title &&
          initialArticles === articles &&
          group.userName === userName &&
          group.isPublished === isPublished) ||
        (!group.id && title === "無題" && articles.length === 0)
      ) {
        return;
      }
      setIsLoading(true);
      const groupId = group.id
        ? await editFavoriteGroup(articles, title, userName, isPublished, group.id)
        : await addFavoriteGroup(articles, title);
      router.push(`/favorite`);
      router.refresh();
      setTimeout(() => {
        toast({
          description: toastStr,
        });
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({
        description: "エラーが発生しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
};
