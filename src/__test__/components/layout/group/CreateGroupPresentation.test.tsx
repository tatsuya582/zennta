import { CreateGroupPresentation } from "@/components/layout/group/CreateGroupPresentation";
import { NotSelectedArticleList } from "@/components/layout/group/NotSelectedArticleList";
import { SelectedArticleList } from "@/components/layout/group/SelectedArticleList";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/layout/group/NotSelectedArticleList", () => ({
  NotSelectedArticleList: jest.fn(() => <div data-testid="not-selected-article-list" />),
}));

jest.mock("@/components/layout/group/SelectedArticleList", () => ({
  SelectedArticleList: jest.fn(() => <div data-testid="selected-article-list" />),
}));

const mockArticles = [
  {
    favoriteId: "1",
    title: "test",
  },
  {
    favoriteId: "2",
    title: "test",
  },
];

const mockTotalPage = 1;

describe("CreateGroupPresentation Component", () => {
  it("renders component", async () => {
    render(<CreateGroupPresentation initArticles={mockArticles} initTotalPage={mockTotalPage} />);
    expect(screen.getByTestId("not-selected-article-list")).toBeInTheDocument();
    expect(screen.getByTestId("selected-article-list")).toBeInTheDocument();
  });

  it("passes correct props to NotSelectedArticleList component", async () => {
    render(<CreateGroupPresentation initArticles={mockArticles} initTotalPage={mockTotalPage} />);
    // useStateがうまくできなかったので関数であるかだけチェック
    expect(NotSelectedArticleList).toHaveBeenCalled();
    const firstCallArgs = (NotSelectedArticleList as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.initArticles).toEqual(mockArticles);
    expect(firstCallArgs.initTotalPage).toBe(mockTotalPage);
    expect(firstCallArgs.selectedArticles).toEqual([]);
    expect(typeof firstCallArgs.setArticles).toBe("function");
    expect(typeof firstCallArgs.setSelectedArticles).toBe("function");
  });

  it("passes correct props to SelectedArticleList component", async () => {
    render(<CreateGroupPresentation initArticles={mockArticles} initTotalPage={mockTotalPage} />);
    expect(SelectedArticleList).toHaveBeenCalled();
    const firstCallArgs = (SelectedArticleList as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.selectedArticles).toEqual([]);
    expect(typeof firstCallArgs.setArticles).toBe("function");
    expect(typeof firstCallArgs.setSelectedArticles).toBe("function");
  });
});
