import { getFavoriteArticles } from "@/actions/favorite";
import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { type FetchedArticles } from "@/types/databaseCustom.types";
import { type Dispatch, type SetStateAction } from "react";

export const GroupPagiNation = ({
  currentPage,
  totalPage,
  query,
  isLoadingNext,
  isLoadingPrev,
  setArticles,
  setCurrentPage,
  setIsLoadingNext,
  setIsLoadingPrev,
}: {
  currentPage: number;
  totalPage: number;
  query: string;
  isLoadingNext: boolean;
  isLoadingPrev: boolean;
  setArticles: Dispatch<SetStateAction<FetchedArticles[]>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setIsLoadingNext: Dispatch<SetStateAction<boolean>>;
  setIsLoadingPrev: Dispatch<SetStateAction<boolean>>;
}) => {
  // const nextPage = async (page: number) => {
  //   try {
  //     setIsLoadingNext(true);
  //     const fetchResult = await getFavoriteArticles(page, query);
  //     if (!fetchResult?.articles) {
  //       return;
  //     } else {
  //       setArticles(fetchResult.articles);
  //       setCurrentPage(page);
  //     }
  //   } finally {
  //     setIsLoadingNext(false);
  //   }
  // };
  // const prevPage = async (page: number) => {
  //   try {
  //     setIsLoadingPrev(true);
  //     const fetchResult = await getFavoriteArticles(page, query);
  //     if (!fetchResult?.articles) {
  //       return;
  //     } else {
  //       setArticles(fetchResult.articles);
  //       setCurrentPage(page);
  //     }
  //   } finally {
  //     setIsLoadingPrev(false);
  //   }
  // };
  const PageNavigation = async (page: number, isNext = false) => {
    try {
      isNext ? setIsLoadingNext(true) : setIsLoadingPrev(true);
      const fetchResult = await getFavoriteArticles(page, query);
      if (!fetchResult?.articles) {
        return;
      } else {
        setArticles(fetchResult.articles);
        setCurrentPage(page);
      }
    } finally {
      isNext ? setIsLoadingNext(false) : setIsLoadingPrev(false);
    }
  };
  return (
    <div className="flex justify-between items-center pb-4 py-2 border-b border-gray-300">
      <div className="w-[102px]">
        {currentPage > 1 && (
          <LoadingButton isLoading={isLoadingPrev} loadingMx="" onSubmit={() => PageNavigation(currentPage - 1)}>
            前のページ
          </LoadingButton>
        )}
      </div>

      <div>{currentPage}ページ</div>
      <div className="w-[102px]">
        {totalPage > currentPage && (
          <LoadingButton isLoading={isLoadingNext} loadingMx="" onSubmit={() => PageNavigation(currentPage + 1, true)}>
            次のページ
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
