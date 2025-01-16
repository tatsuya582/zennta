"use client";

import { useState } from "react";
import { NotSelectedArticleList } from "@/components/layout/group/NotSelectedArticleList";
import { SelectedArticleList } from "@/components/layout/group/SelectedArticleList";
import { LoadingButton } from "@/components/layout/button/LoadingButton";
import { getCreateGroupArticles } from "@/actions/group";
import { type groupArticle } from "@/types/types";
import { type FavoriteGroup } from "@/types/databaseCustom.types";

export const EditGroup = ({ initArticles, group }: { initArticles: groupArticle[]; group: FavoriteGroup }) => {
  const [articles, setArticles] = useState<groupArticle[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<groupArticle[]>([]);
  const [favoritePage, setFavoritePage] = useState(1);
  const [selectedArticles, setSelectedArticles] = useState<groupArticle[]>(initArticles);
  const [deleteArticles, setDeleteArticles] = useState<groupArticle[]>([]);
  const [openNewArticles, setOpenNewArticles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openArticles = async () => {
    try {
      setIsLoading(true);
      const fetchResult = await getCreateGroupArticles(1, "");
      if (!fetchResult?.articles) {
        return;
      } else {
        setFavoriteArticles(fetchResult.articles);
        setArticles(fetchResult.articles);
        setFavoritePage(fetchResult.totalPage);
        setOpenNewArticles(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SelectedArticleList
        selectedArticles={selectedArticles}
        setArticles={setArticles}
        setSelectedArticles={setSelectedArticles}
        setDeleteArticles={setDeleteArticles}
        initArticles={initArticles}
        group={group}
      />
      <div className="w-full mt-8">
        <SelectedArticleList
          selectedArticles={deleteArticles}
          setArticles={setSelectedArticles}
          setSelectedArticles={setDeleteArticles}
          isDelete
        />
      </div>
      <div className="w-11/12 my-4 mx-auto" data-testid="add-articles">
        <LoadingButton isLoading={isLoading} loadingMx="" onSubmit={openArticles}>
          記事を追加
        </LoadingButton>
      </div>
      {openNewArticles && (
        <div>
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
          <NotSelectedArticleList
            initTotalPage={favoritePage}
            initArticles={favoriteArticles}
            articles={articles}
            selectedArticles={selectedArticles}
            deleteArticles={deleteArticles}
            setArticles={setArticles}
            setSelectedArticles={setSelectedArticles}
          />
        </div>
      )}
    </div>
  );
};
