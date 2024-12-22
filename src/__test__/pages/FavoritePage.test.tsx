import { render, screen } from "@testing-library/react";
import FavoritePage from "@/app/favorite/page";
import React from "react";

jest.mock("@/actions/favorite", () => ({
  getFavoriteArticles: jest.fn(),
}));

jest.mock("@/components/layout/form/SearchForm", () => ({
  SearchForm: jest.fn(({ query, linkPage }) => (
    <div data-testid="search-form">
      <p>{`query=${query}`}</p>
      <p>{`linkPage=${linkPage}`}</p>
    </div>
  )),
}));

jest.mock("@/components/layout/main/StoredArticleList", () => ({
  StoredArticleList: jest.fn(() => <div data-testid="stored-article-list" />),
}));

jest.mock("@/components/layout/skeleton/ArticleListSkeleton", () => ({
  ArticleListSkeleton: jest.fn(() => <div data-testid="article-list-skeleton" />),
}));

describe("FavoritePage", () => {
  const mockPage = 1;
  const mockQuery = "test-query";

  const renderFavoritePage = (page = mockPage, query = mockQuery) => {
    render(
      <FavoritePage
        searchParams={{
          page: page.toString(),
          query,
        }}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the SearchForm and StoredArticleList components", async () => {
    renderFavoritePage();

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
    expect(screen.getByTestId("stored-article-list")).toBeInTheDocument();
  });

  it("should render SearchForm with correct query and linkPage props", () => {
    renderFavoritePage();

    expect(screen.getByText("query=test-query")).toBeInTheDocument();
    expect(screen.getByText("linkPage=favorite")).toBeInTheDocument();
  });

  it("should correctly pass buildHref to StoredArticleList", () => {
    renderFavoritePage();

    const StoredArticleListMock = require("@/components/layout/main/StoredArticleList").StoredArticleList;
    expect(StoredArticleListMock).toHaveBeenCalled();

    const passedProps = StoredArticleListMock.mock.calls[0][0];
    expect(passedProps.buildHref(3)).toBe("/favorite?query=test-query&page=3");
  });

  it("should pass getFavoriteArticles as fetchArticles to StoredArticleList", () => {
    renderFavoritePage();

    const StoredArticleListMock = require("@/components/layout/main/StoredArticleList").StoredArticleList;
    expect(StoredArticleListMock).toHaveBeenCalled();

    const passedProps = StoredArticleListMock.mock.calls[0][0];
    expect(passedProps.fetchArticles).toBe(require("@/actions/favorite").getFavoriteArticles);
  });
});
