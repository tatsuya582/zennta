import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

export default async function LessStoredPagiNation({
  currentPage,
  totalPage,
}: {
  currentPage: number;
  totalPage: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {Array.from({ length: totalPage }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink href={`/readlater?page=${pageNumber}`} isActive={pageNumber === currentPage}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
