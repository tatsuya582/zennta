import { NotSelectedArticleList } from "@/components/layout/group/NotSelectedArticleList";
import { render, screen } from "@testing-library/react";
import { GroupSearchForm } from "@/components/layout/group/GroupSearchForm";
import { GroupPagiNation } from "@/components/layout/group/GroupPagiNation";
import { type Dispatch, type SetStateAction } from "react";
import { type groupArticle } from "@/types/types";

jest.mock("@/components/layout/group/GroupPagiNation", () => ({
  GroupPagiNation: jest.fn(() => <div data-testid="group-pagination" />),
}));

jest.mock("@/components/layout/group/GroupSearchForm", () => ({
  GroupSearchForm: jest.fn(() => <div data-testid="group-search-form" />),
}));

const mockArticles = [
  {
    favoriteId: "1",
    title: "test-title1",
  },
  {
    favoriteId: "2",
    title: "test-title2",
  },
];

const mockTotalPage = 1;
const setArticlesMock = jest.fn() as jest.MockedFunction<Dispatch<SetStateAction<groupArticle[]>>>;

describe("NotSelectedArticleList Component", () => {
  it("renders component", async () => {
    render(
      <NotSelectedArticleList
        initArticles={mockArticles}
        initTotalPage={mockTotalPage}
        articles={mockArticles}
        selectedArticles={[]}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
      />
    );
    expect(screen.getAllByTestId("group-pagination")).toHaveLength(2);
    expect(screen.getByTestId("group-search-form")).toBeInTheDocument();
    expect(screen.getByText("test-title1")).toBeInTheDocument();
    expect(screen.getByText("test-title2")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "選択" })).toHaveLength(2);
  });

  it("renders component", async () => {
    render(
      <NotSelectedArticleList
        initArticles={mockArticles}
        initTotalPage={mockTotalPage}
        articles={[]}
        selectedArticles={[]}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
      />
    );
    expect(screen.getByTestId("group-search-form")).toBeInTheDocument();
    expect(screen.getByText("記事がありません")).toBeInTheDocument();
  });

  it("passes correct props to GroupSearchForm component", async () => {
    render(
      <NotSelectedArticleList
        initArticles={mockArticles}
        initTotalPage={mockTotalPage}
        articles={mockArticles}
        selectedArticles={[]}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
      />
    );

    expect(GroupSearchForm).toHaveBeenCalled();
    const firstCallArgs = (GroupSearchForm as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.query).toEqual("");
    expect(firstCallArgs.currentPage).toBe(1);
  });

  it("passes correct props to GroupPagiNation component", async () => {
    render(
      <NotSelectedArticleList
        initArticles={mockArticles}
        initTotalPage={mockTotalPage}
        articles={mockArticles}
        selectedArticles={[]}
        setArticles={setArticlesMock}
        setSelectedArticles={setArticlesMock}
      />
    );
    expect(GroupPagiNation).toHaveBeenCalled();
    const firstCallArgs = (GroupPagiNation as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.currentPage).toEqual(1);
    expect(firstCallArgs.totalPage).toEqual(mockTotalPage);
    expect(firstCallArgs.isLoadingNext).toEqual(false);
    expect(firstCallArgs.isLoadingPrev).toEqual(false);
  });
});
