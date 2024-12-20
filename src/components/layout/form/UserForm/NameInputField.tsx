import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const NameInputField = ({ control }: { control: any }) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>名前</FormLabel>
          <FormControl>
            <Input placeholder="名前" {...field} className="border p-2" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
