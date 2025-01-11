import { getCreateGroupArticles } from "@/actions/group";
import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type groupArticle } from "@/types/types";
import { type Dispatch, FormEvent, type SetStateAction, useState } from "react";

export const GroupSearchForm = ({
  query,
  currentPage,
  setTotalPage,
  setArticles,
  setQuery,
  clearQuery,
}: {
  query: string;
  currentPage: number;
  setTotalPage: Dispatch<SetStateAction<number>>;
  setArticles: Dispatch<SetStateAction<groupArticle[]>>;
  setQuery: Dispatch<SetStateAction<string>>;
  clearQuery: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newQuery, setNewQuery] = useState(query);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (query === newQuery) {
      return;
    }
    try {
      setIsLoading(true);
      const fetchResult = await getCreateGroupArticles(currentPage, newQuery);
      if (!fetchResult?.articles) {
        setArticles([]);
        return;
      } else {
        setArticles(fetchResult.articles);
        setQuery(newQuery);
        setTotalPage(fetchResult.totalPage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full my-4 flex gap-1">
      <form onSubmit={handleSubmit} role="form" className="w-full flex gap-2 mx-2">
        <Input
          type="text"
          name="query"
          placeholder="検索ワードを入力"
          value={newQuery}
          onChange={(e) => setNewQuery(e.target.value)}
        />
        <div className="w-[62px]">
          <LoadingButton isLoading={isLoading} loadingMx="mx-1">
            検索
          </LoadingButton>
        </div>
      </form>
      <div className="w-[76px]">
        <Button variant="outline" onClick={clearQuery}>
          クリア
        </Button>
      </div>
    </div>
  );
};
