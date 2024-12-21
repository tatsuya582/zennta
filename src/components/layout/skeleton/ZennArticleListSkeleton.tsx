import { Skeleton } from "@/components/ui/skeleton";

export const ZennArticleListSkeleton = () => {
  return (
    <div className="mt-4">
      <div className="flex justify-center border-b border-gray-300 mb-2 pb-4 gap-4">
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination" />
      </div>
      {[...Array(30)].map((_, index) => (
        <div key={index} className="border-b border-gray-300 mb-2 mx-2 pb-1">
          <Skeleton className="w-11/12 h-6 mx-auto mb-2" data-testid="skeleton-list-item" />
        </div>
      ))}
      <div className="flex justify-center border-b border-gray-300 mb-2 pb-4 gap-4">
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination-bottom" />
        <Skeleton className="w-8 h-6" data-testid="skeleton-pagination-bottom" />
      </div>
    </div>
  );
};
