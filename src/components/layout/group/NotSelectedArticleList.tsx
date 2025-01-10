import { GroupPagiNation } from "@/components/layout/group/GroupPagiNation";
import { GroupSearchForm } from "@/components/layout/group/GroupSearchForm";
import { Button } from "@/components/ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import { type FetchedArticles } from "@/types/databaseCustom.types";

export const NotSelectedArticleList = ({
  initTotalPage,
  initArticles,
  articles,
  selectedArticles,
  setArticles,
  setSelectedArticles,
}: {
  initTotalPage: number;
  initArticles: FetchedArticles[];
  articles: FetchedArticles[];
  selectedArticles: FetchedArticles[];
  setArticles: Dispatch<SetStateAction<FetchedArticles[]>>;
  setSelectedArticles: Dispatch<SetStateAction<FetchedArticles[]>>;
}) => {
  const [totalPage, setTotalPage] = useState(initTotalPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);

  const addGroup = (article: FetchedArticles) => {
    setSelectedArticles((prev) => {
      if (prev.some((item) => item.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };
  const clearQuery = () => {
    setArticles(initArticles);
    setQuery("");
    setTotalPage(initTotalPage);
    setCurrentPage(1);
  };
  return (
    <div className="w-full md:border border-y md:rounded-lg rounded-none p-2 mt-2 border-gray-300">
      <GroupSearchForm
        query={query}
        currentPage={currentPage}
        setTotalPage={setTotalPage}
        setArticles={setArticles}
        setQuery={setQuery}
        clearQuery={clearQuery}
      />
      {articles.length !== 0 ? (
        <div>
          <GroupPagiNation
            currentPage={currentPage}
            totalPage={totalPage}
            query={query}
            isLoadingNext={isLoadingNext}
            isLoadingPrev={isLoadingPrev}
            setArticles={setArticles}
            setCurrentPage={setCurrentPage}
            setIsLoadingNext={setIsLoadingNext}
            setIsLoadingPrev={setIsLoadingPrev}
          />
          {articles.map((item) => (
            <div key={item.id}>
              {!selectedArticles.find((choice) => choice.id === item.id) && (
                <div className="w-full flex justify-between items-center py-1 border-b border-gray-300">
                  <div>{item.title}</div>
                  <Button variant="outline" onClick={() => addGroup(item)}>
                    選択
                  </Button>
                </div>
              )}
            </div>
          ))}
          <GroupPagiNation
            currentPage={currentPage}
            totalPage={totalPage}
            query={query}
            isLoadingNext={isLoadingNext}
            isLoadingPrev={isLoadingPrev}
            setArticles={setArticles}
            setCurrentPage={setCurrentPage}
            setIsLoadingNext={setIsLoadingNext}
            setIsLoadingPrev={setIsLoadingPrev}
          />
        </div>
      ) : (
        <div className="h-16 flex items-center">記事が選択されていません</div>
      )}
    </div>
  );
};
