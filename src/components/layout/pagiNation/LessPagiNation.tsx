import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

export default async function LessPagiNation({
  currentPage,
  totalPage,
  buildHref,
}: {
  currentPage: number;
  totalPage: number;
  buildHref: (pageNumber: number) => string;
}) {
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
}
