import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { type PagiNationProps } from "@/types/types";

export const LessPagiNation = ({ currentPage, totalPage, buildHref }: PagiNationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        {Array.from({ length: totalPage }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink href={buildHref(pageNumber)} isActive={pageNumber === currentPage}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
};
