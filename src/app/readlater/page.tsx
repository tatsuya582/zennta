import { getReadLaterArticles } from "@/actions/readLater";
import StoredArticleList from "@/components/layout/main/StoredArticleList";
import QiitaArticleListSkeleton from "@/components/layout/skeleton/QiitaArticleListSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ReadLaterPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const page = searchParams?.page ? parseInt(searchParams.page, 10) || 1 : 1;
  const query = searchParams?.query ? searchParams.query : null;
  const buildHref = (pageNumber: number) => `/readlater?page=${pageNumber}`;
  const onsubmit = async (formData: FormData) => {
    "use server";
    const name = formData.get("name")?.toString().trim() || "";
    const encodedName = encodeURIComponent(name);
    redirect(`/readlater?query=${encodedName}`);
  };

  return (
    <>
      <div className="flex items-center justify-center my-12">
        <form action={onsubmit} className="flex gap-4 w-9/12 max-w-screen-sm">
          <Input type="name" name="name" defaultValue={query || ""} />
          <Button>検索</Button>
        </form>
      </div>
      <div className="w-full flex justify-center items-center flex-col md:mt-2 mt-8 mb-4">
        <h2>後で読む</h2>
        <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
          <Suspense key={JSON.stringify(searchParams)} fallback={<QiitaArticleListSkeleton />}>
            <StoredArticleList page={page} query={query} fetchArticles={getReadLaterArticles} buildHref={buildHref} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
