import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function ZennSearchPagiNation({
  query,
  qiitaPage,
  zennPage,
  next,
}: {
  query: string;
  qiitaPage: number;
  zennPage: number;
  next: number | null;
}) {
  const currentPage = zennPage;
  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=1#zennarticles`}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <PaginationPrevious
                href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${zennPage - 1}#zennarticles`}
              />
            </PaginationItem>
            {currentPage >= 5 && <PaginationEllipsis className="hidden md:flex" />}
            {currentPage >= 4 && (
              <PaginationItem>
                <PaginationLink
                  href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${zennPage - 3}#zennarticles`}
                >
                  {currentPage - 3}
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage >= 3 && (
              <PaginationItem>
                <PaginationLink
                  href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${zennPage - 2}#zennarticles`}
                >
                  {currentPage - 2}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${zennPage - 1}#zennarticles`}
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink
            href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${zennPage}#zennarticles`}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {next && (
          <>
            <PaginationItem>
              <PaginationNext
                href={`/search?query=${query}&qiitapage=${qiitaPage}&zennpage=${zennPage + 1}#zennarticles`}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
