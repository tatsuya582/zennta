import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function SearchForm({
  query = "",
  linkPage,
}: {
  query?: string;
  linkPage: "search" | "favorite" | "readlater";
}) {
  const onsubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name")?.toString().trim() || "";
    const encodedName = encodeURIComponent(name);
    redirect(`/${linkPage}?query=${encodedName}`);
  };

  return (
    <div className="flex items-center justify-center mt-8 mb-4">
      <form action={onsubmit} className="flex gap-2 md:w-9/12 w-full mx-2 max-w-screen-sm">
        <Input type="name" name="name" placeholder="検索ワードを入力" defaultValue={query} />
        <Button>検索</Button>
      </form>
    </div>
  );
}
