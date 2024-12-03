import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function SearchForm({
  query = "",
  linkPage,
  isNoQuery = false,
}: {
  query?: string;
  linkPage: "search" | "favorite" | "readlater";
  isNoQuery?: boolean;
}) {
  const layoutClass = isNoQuery
    ? "h-[80vh] flex flex-col items-center justify-center mx-2 gap-8"
    : "flex items-center justify-center mt-8 mb-4";
  const onsubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name")?.toString().trim() || "";
    const encodedName = encodeURIComponent(name);
    redirect(`/${linkPage}?query=${encodedName}`);
  };

  return (
    <div className={layoutClass}>
      {isNoQuery && <h2>検索</h2>}
      <form action={onsubmit} className="flex gap-2 md:w-9/12 w-full mx-2 max-w-screen-sm">
        <Input type="name" name="name" placeholder="検索ワードを入力" defaultValue={query} />
        <Button>検索</Button>
      </form>
      {isNoQuery && <p className="text-gray-500 text-sm mt-4">なにか入力してください</p>}
    </div>
  );
}
