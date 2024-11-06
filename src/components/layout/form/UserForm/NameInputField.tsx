import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function NameInputField({ control, edit }: { control: any; edit: boolean }) {
  return (
    <FormField
      control={control}
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
          {edit && <FormDescription>名前は2文字以上、50文字以下にしてください</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
