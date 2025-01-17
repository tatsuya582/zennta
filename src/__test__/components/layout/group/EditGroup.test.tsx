import { EditGroup } from "@/components/layout/group/EditGroup";
import { SelectedArticleList } from "@/components/layout/group/SelectedArticleList";
import { render, screen } from "@testing-library/react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

jest.mock("@/components/layout/group/NotSelectedArticleList", () => ({
  NotSelectedArticleList: jest.fn(() => <div data-testid="not-selected-article-list" />),
}));

jest.mock("@/components/layout/group/SelectedArticleList", () => ({
  SelectedArticleList: jest.fn(() => <div data-testid="selected-article-list" />),
}));

jest.mock("@/components/layout/button/LoadingButton", () => ({
  LoadingButton: jest.fn(() => <div data-testid="loading-button" />),
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

const mockGroup = {
  createdAt: "2024-01-01",
  id: "1",
  isPublished: true,
  title: "test title",
  updatedAt: "2024-01-01",
  userId: "1",
  userName: "test name",
};

describe("EditGroup Component", () => {
  it("renders component", async () => {
    render(<EditGroup initArticles={mockArticles} group={mockGroup} />);
    expect(screen.getByTestId("loading-button")).toBeInTheDocument();
    expect(screen.getAllByTestId("selected-article-list")).toHaveLength(2);
  });

  it("passes correct props to SelectedArticleList component first", async () => {
    render(<EditGroup initArticles={mockArticles} group={mockGroup} />);
    expect(SelectedArticleList).toHaveBeenCalled();
    const firstCallArgs = (SelectedArticleList as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.selectedArticles).toEqual(mockArticles);
    expect(typeof firstCallArgs.setArticles).toBe("function");
    expect(typeof firstCallArgs.setSelectedArticles).toBe("function");
    expect(typeof firstCallArgs.setDeleteArticles).toBe("function");
    expect(firstCallArgs.initArticles).toEqual(mockArticles);
    expect(firstCallArgs.group).toEqual(mockGroup);
  });

  it("passes correct props to SelectedArticleList component second", async () => {
    render(<EditGroup initArticles={mockArticles} group={mockGroup} />);
    expect(SelectedArticleList).toHaveBeenCalled();
    const secondCallArgs = (SelectedArticleList as jest.Mock).mock.calls[1][0];
    expect(secondCallArgs.selectedArticles).toEqual([]);
    expect(typeof secondCallArgs.setArticles).toBe("function");
    expect(typeof secondCallArgs.setSelectedArticles).toBe("function");
    expect(secondCallArgs.isDelete).toEqual(true);
  });
});
