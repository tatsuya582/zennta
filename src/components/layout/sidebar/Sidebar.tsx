import { ArticleHistory } from "@/components/layout/sidebar/ArticleHistory";
import { currentUser } from "@/lib/auth/currentUser/server";
import { Suspense } from "react";

export default async function Sidebar() {
  const { user } = await currentUser();
  return (
    <>
      <aside className="sidebar md:flex hidden w-1/4 max-w-xs overflow-y-auto h-[calc(100vh-95px)] fixed top-24 border-r border-gray-300">
        <div className="w-full p-4">
          <h2>履歴</h2>
          {user && (
            <Suspense>
              <ArticleHistory />
            </Suspense>
          )}
        </div>
      </aside>
    </>
  );
}
