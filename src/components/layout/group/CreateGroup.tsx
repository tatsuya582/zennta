"use client";

import { type FetchedArticles } from "@/types/databaseCustom.types";
import { useState } from "react";
import { NotSelectedArticleList } from "@/components/layout/group/NotSelectedArticleList";
import { SelectedArticleList } from "@/components/layout/group/SelectedArticleList";
import { groupArticle } from "@/types/types";

export const CreateGroupPage = ({
  initArticles,
  initTotalPage,
}: {
  initArticles: groupArticle[];
  initTotalPage: number;
}) => {
  const [articles, setArticles] = useState<groupArticle[]>(initArticles);
  const [selectedArticles, setSelectedArticles] = useState<groupArticle[]>([]);

  return (
    <div>
      <NotSelectedArticleList
        initTotalPage={initTotalPage}
        initArticles={initArticles}
        articles={articles}
        selectedArticles={selectedArticles}
        setArticles={setArticles}
        setSelectedArticles={setSelectedArticles}
      />
      <div className="flex justify-center my-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <SelectedArticleList
        selectedArticles={selectedArticles}
        setArticles={setArticles}
        setSelectedArticles={setSelectedArticles}
      />
    </div>
  );
};
