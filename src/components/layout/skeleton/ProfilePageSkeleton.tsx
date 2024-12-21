import { Skeleton } from "@/components/ui/skeleton";

export const ProfilePageSkeleton = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-6 items-center md:w-2/3 max-w-lg w-full md:p-12 p-6 md:mt-2 mt-6 md:border rounded-lg border-gray-300">
        <h2 className="text-center">マイページ</h2>
        <div className="flex flex-col gap-6 w-full">
          <Skeleton className="w-11/12 aspect-square rounded-full p-4" data-testid="skeleton-image" />
        </div>
        <div className="w-11/12 max-w-lg px-8 py-4 md:mt-2 mt-6 border rounded-lg border-gray-300">
          <Skeleton className="w-full h-12" data-testid="skeleton-button" />
        </div>
      </div>
    </div>
  );
};
