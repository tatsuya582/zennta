import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type PagiNationProps } from "@/types/types";

export const PagiNation = ({ currentPage, totalPage, buildHref }: PagiNationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={buildHref(1)}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Go to the first page"
                >
                  <path
                    d="M6.85355 3.85355C7.04882 3.65829 7.04882 3.34171 6.85355 3.14645C6.65829 2.95118 6.34171 2.95118 6.14645 3.14645L2.14645 7.14645C1.95118 7.34171 1.95118 7.65829 2.14645 7.85355L6.14645 11.8536C6.34171 12.0488 6.65829 12.0488 6.85355 11.8536C7.04882 11.6583 7.04882 11.3417 6.85355 11.1464L3.20711 7.5L6.85355 3.85355ZM12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8.14645 7.14645C7.95118 7.34171 7.95118 7.65829 8.14645 7.85355L12.1464 11.8536C12.3417 12.0488 12.6583 12.0488 12.8536 11.8536C13.0488 11.6583 13.0488 11.3417 12.8536 11.1464L9.20711 7.5L12.8536 3.85355Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious href={buildHref(currentPage - 1)} />
            </PaginationItem>
            {currentPage >= 3 && <PaginationEllipsis className="hidden md:flex" />}
            {currentPage === totalPage && (
              <PaginationItem>
                <PaginationLink href={buildHref(currentPage - 2)}>{currentPage - 2}</PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={buildHref(currentPage - 1)}>{currentPage - 1}</PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink href={buildHref(currentPage)} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage !== totalPage && (
          <>
            <PaginationItem>
              <PaginationLink href={buildHref(currentPage + 1)}>{currentPage + 1}</PaginationLink>
            </PaginationItem>
            {currentPage === 1 && (
              <PaginationItem>
                <PaginationLink href={buildHref(currentPage + 2)}>{currentPage + 2}</PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              {currentPage + 1 < totalPage && <PaginationEllipsis className="hidden md:flex" />}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={buildHref(currentPage + 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={buildHref(totalPage)}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Go to the last page"
                >
                  <path
                    d="M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};
