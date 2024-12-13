"use client";

import LoadingButton from "@/components/layout/button/LoadingButton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function SearchForm({
  query = "",
  linkPage,
  isNoQuery = false,
}: {
  query?: string;
  linkPage: "search" | "favorite" | "readlater";
  isNoQuery?: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(query);
  const [isLoading, setIsLoading] = useState(false);
  const layoutClass = isNoQuery
    ? "h-[80vh] flex flex-col items-center justify-center mx-2 gap-8"
    : "flex items-center justify-center mt-8 mb-4";
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (query === name.trim()) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const encodedName = encodeURIComponent(name.trim());
    router.push(`/${linkPage}?query=${encodedName}`);
  };

  return (
    <div className={layoutClass}>
      {isNoQuery && <h2>検索</h2>}
      <form onSubmit={handleSubmit} className="flex gap-2 md:w-9/12 w-full mx-2 max-w-screen-sm">
        <Input
          type="text"
          name="name"
          placeholder="検索ワードを入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <LoadingButton isLoading={isLoading} loadingMx="mx-1">
            検索
          </LoadingButton>
        </div>
      </form>
      {isNoQuery && <p className="text-gray-500 text-sm mt-4">なにか入力してください</p>}
    </div>
  );
}
