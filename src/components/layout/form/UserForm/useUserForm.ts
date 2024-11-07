import { updateUser } from "@/actions/user";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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

type UseUserFormReturn = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  isLoading: boolean;
};

export const useUserForm = (initialName: string): UseUserFormReturn => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialName,
    },
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (initialName === values.name) {
      return;
    }
    try {
      setIsLoading(true);
      await updateUser(values.name);
      toast({
        description: "名前を変更しました",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
};
