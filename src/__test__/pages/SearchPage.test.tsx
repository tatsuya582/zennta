import { render, screen } from "@testing-library/react";
import SearchPage, { metadata } from "@/app/search/page";
import { ArticleList } from "@/components/layout/main/ArticleList";

jest.mock("@/components/layout/form/SearchForm", () => ({
  SearchForm: jest.fn(({ query, linkPage, isNoQuery }) => (
    <div data-testid="search-form">
      <p>{`query=${query}`}</p>
      <p>{`linkPage=${linkPage}`}</p>
      <p>{`isNoQuery=${isNoQuery}`}</p>
    </div>
  )),
}));

jest.mock("@/components/layout/main/ArticleList", () => ({
  ArticleList: jest.fn(() => <div data-testid="article-list" />),
}));

jest.mock("@/components/layout/skeleton/ArticleListSkeleton", () => ({
  ArticleListSkeleton: jest.fn(() => <div data-testid="article-list-skeleton" />),
}));
jest.mock("@/components/layout/skeleton/ZennArticleListSkeleton", () => ({
  ZennArticleListSkeleton: jest.fn(() => <div data-testid="zenn-article-list-skeleton" />),
}));

describe("SearchPage", () => {
  const mockQiitaPage = "2";
  const mockZennPage = "3";
  const mockQuery = "test-query";

  const renderSearchPage = (query = mockQuery, qiitaPage = mockQiitaPage, zennPage = mockZennPage) => {
    render(
      <SearchPage
        searchParams={{
          query,
          qiitapage: qiitaPage.toString(),
          zennpage: zennPage.toString(),
        }}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the page with correct components and elements", () => {
    renderSearchPage();

    expect(screen.getByTestId("search-form")).toBeInTheDocument();
    const articleLists = screen.getAllByTestId("article-list");
    expect(articleLists).toHaveLength(2);

    expect(screen.getByRole("heading", { level: 2, name: "Qiita一覧" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Zenn一覧" })).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("検索");
  });

  it("should render SearchForm with correct query and linkPage props", () => {
    renderSearchPage();

    expect(screen.getByText("query=test-query")).toBeInTheDocument();
    expect(screen.getByText("linkPage=search")).toBeInTheDocument();
    expect(screen.getByText("isNoQuery=undefined")).toBeInTheDocument();
  });

  it("should render SearchForm with isNoQuery=true when query is empty", () => {
    const mockQuery = "";
    renderSearchPage(mockQuery);

    expect(screen.getByText("query=")).toBeInTheDocument();
    expect(screen.getByText("linkPage=search")).toBeInTheDocument();
    expect(screen.getByText("isNoQuery=true")).toBeInTheDocument();
  });
  it("should pass correct props to ArticleList for Qiita", () => {
    renderSearchPage();

    expect(ArticleList).toHaveBeenCalled();

    const passedProps = (ArticleList as jest.Mock).mock.calls[0][0];
    expect(passedProps.currentPage).toBe(2);
    expect(passedProps.otherPage).toBe(3);
    expect(passedProps.currentSite).toBe("Qiita");
    expect(passedProps.query).toBe("test-query");
    expect(passedProps.isSearch).toBe(true);
  });

  it("should pass default page values to ArticleList for Qiita when page parameters are empty", () => {
    const mockQiitaPage = "";
    const mockZennPage = "";
    renderSearchPage(mockQuery, mockQiitaPage, mockZennPage);

    expect(ArticleList).toHaveBeenCalled();

    const passedProps = (ArticleList as jest.Mock).mock.calls[0][0];
    expect(passedProps.currentPage).toBe(1);
    expect(passedProps.otherPage).toBe(1);
    expect(passedProps.currentSite).toBe("Qiita");
    expect(passedProps.query).toBe("test-query");
    expect(passedProps.isSearch).toBe(true);
  });

  it("should pass correct props to ArticleList for Zenn", () => {
    renderSearchPage();

    expect(ArticleList).toHaveBeenCalled();

    const passedProps = (ArticleList as jest.Mock).mock.calls[1][0];
    expect(passedProps.currentPage).toBe(3);
    expect(passedProps.otherPage).toBe(2);
    expect(passedProps.currentSite).toBe("Zenn");
    expect(passedProps.query).toBe("test-query");
    expect(passedProps.isSearch).toBe(true);
  });
});
