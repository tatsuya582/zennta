import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { type QiitaSearchPagiNationProps } from "@/types/types";

export default async function LessSearchPagiNation({
  query,
  qiitaPage,
  zennPage,
  totalPage,
}: QiitaSearchPagiNationProps) {
  return (
    <Pagination>
      <PaginationContent>
        {Array.from({ length: totalPage }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={`/search?query=${query}&qiitapage=${pageNumber}&zennpage=${zennPage}`}
                isActive={pageNumber === qiitaPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
