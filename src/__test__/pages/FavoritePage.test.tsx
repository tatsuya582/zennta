import { render, screen } from "@testing-library/react";
import FavoritePage, { metadata } from "@/app/favorite/page";
import { StoredArticleList } from "@/components/layout/main/StoredArticleList";
import { getFavoriteArticles } from "@/actions/favorite";

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

jest.mock("@/components/layout/form/AddArticleForm", () => ({
  AddArticleForm: jest.fn(() => <div data-testid="add-article-form" />),
}));

jest.mock("@/components/layout/main/GroupList", () => ({
  GroupList: jest.fn(() => <div data-testid="group-list" />),
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

  it("should render the page with correct components and elements", () => {
    renderFavoritePage();

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
    expect(screen.getByTestId("stored-article-list")).toBeInTheDocument();
    expect(screen.getByTestId("add-article-form")).toBeInTheDocument();
    expect(screen.getByTestId("group-list")).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: "お気に入り" })).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("お気に入り");
  });

  it("should render SearchForm with correct query and linkPage props", () => {
    renderFavoritePage();

    expect(screen.getByText("query=test-query")).toBeInTheDocument();
    expect(screen.getByText("linkPage=favorite")).toBeInTheDocument();
  });

  it("should correctly pass buildHref to StoredArticleList", () => {
    renderFavoritePage();

    expect(StoredArticleList).toHaveBeenCalled();

    const passedProps = (StoredArticleList as jest.Mock).mock.calls[0][0];
    expect(passedProps.buildHref(3)).toBe("/favorite?query=test-query&page=3");
  });

  it("should pass getFavoriteArticles as fetchArticles to StoredArticleList", () => {
    renderFavoritePage();

    expect(StoredArticleList).toHaveBeenCalled();

    const passedProps = (StoredArticleList as jest.Mock).mock.calls[0][0];
    expect(passedProps.fetchArticles).toBe(getFavoriteArticles);
  });
});
