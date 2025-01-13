import { render, screen } from "@testing-library/react";
import { StoredArticleList } from "@/components/layout/main/StoredArticleList";
import ReadLaterPage, { metadata } from "@/app/readlater/page";
import { getReadLaterArticles } from "@/actions/readLater";

jest.mock("@/actions/readLater", () => ({
  getReadLaterArticles: jest.fn(),
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

describe("ReadLaterPage", () => {
  const mockPage = 1;
  const mockQuery = "test-query";

  const renderReadLaterPage = (page = mockPage, query = mockQuery) => {
    render(
      <ReadLaterPage
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
    renderReadLaterPage();

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
    expect(screen.getByTestId("stored-article-list")).toBeInTheDocument();
    expect(screen.getByTestId("add-article-form")).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: "後で読む" })).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("後で読む");
  });

  it("should render SearchForm with correct query and linkPage props", () => {
    renderReadLaterPage();

    expect(screen.getByText("query=test-query")).toBeInTheDocument();
    expect(screen.getByText("linkPage=readlater")).toBeInTheDocument();
  });

  it("should correctly pass buildHref to StoredArticleList", () => {
    renderReadLaterPage();

    expect(StoredArticleList).toHaveBeenCalled();

    const passedProps = (StoredArticleList as jest.Mock).mock.calls[0][0];
    expect(passedProps.buildHref(3)).toBe("/readlater?query=test-query&page=3");
  });

  it("should pass getReadlaterArticles as fetchArticles to StoredArticleList", () => {
    renderReadLaterPage();

    expect(StoredArticleList).toHaveBeenCalled();

    const passedProps = (StoredArticleList as jest.Mock).mock.calls[0][0];
    expect(passedProps.fetchArticles).toBe(getReadLaterArticles);
  });
});
