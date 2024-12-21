import { Skeleton } from "@/components/ui/skeleton";

export const ArticleListSkeleton = () => {
  return (
    <div>
      <div className="flex justify-center border-b border-gray-300 mb-2 pb-4 gap-4">
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination" />
      </div>
      <div className="mt-4">
        {[...Array(30)].map((_, index) => (
          <div key={index} className="border-b border-gray-300 mb-2 pb-1">
            <Skeleton className="w-11/12 h-8 mx-auto my-2" data-testid="skeleton-list-item" />
            <div className="flex gap-2 flex-wrap w-11/12 mx-auto pl-2">
              <Skeleton className="w-24 h-7 px-3" />
              <Skeleton className="w-24 h-7 px-3" />
              <Skeleton className="w-24 h-7 px-3" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center border-b border-gray-300 mb-2 pb-4 gap-4">
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-8" data-testid="skeleton-pagination-bottom" />
      </div>
    </div>
  );
};
