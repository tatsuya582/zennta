import { Skeleton } from "@/components/ui/skeleton";

export default async function ZennArticleListSkeleton() {
  return (
    <div className="mt-4 h-screen overflow-y-auto scrollbar">
      <div className="flex justify-center border-b border-gray-300 mb-2 pb-4 gap-4">
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
      </div>
      {[...Array(15)].map((_, index) => (
        <div key={index} className="border-b border-gray-300 mb-2 mx-2 pb-1">
          <Skeleton className="w-11/12 h-6 mx-auto mb-2" />
        </div>
      ))}
      <div className="flex justify-center border-b border-gray-300 mb-2 pb-4 gap-4">
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
        <Skeleton className="w-8 h-6" />
      </div>
    </div>
  );
}
