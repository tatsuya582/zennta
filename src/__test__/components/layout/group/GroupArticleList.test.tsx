import { addStoredItemHistory } from "@/actions/history";
import { GroupArticleList } from "@/components/layout/group/GroupArticleList";
import { Article } from "@/components/layout/main/Article";
import { MemoDisplay } from "@/components/layout/memo/MemoDisplay";
import { render, screen } from "@testing-library/react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

jest.mock("@/components/layout/main/Article", () => ({
  Article: jest.fn(() => <div data-testid="Article" />),
}));

jest.mock("@/components/layout/memo/MemoDisplay", () => ({
  MemoDisplay: jest.fn(() => <div data-testid="MemoDisplay" />),
}));

jest.mock("@/actions/history", () => ({
  addStoredItemHistory: jest.fn(),
}));

const mockArticle = {
  id: "1",
  column_id: "1",
  other_column_id: null,
  url: "https://example.com/1",
  tags: [{ name: "tag1" }, { name: "tag2" }],
  custom_tags: null,
  memo: "This is a memo1",
  title: "Sample Title1",
  is_in_other_table: false,
  articleId: null,
  createdAt: "2024-01-01T00:00:00Z",
  userId: "user-123",
};
const mockArticles = [
  mockArticle,
  {
    id: "2",
    column_id: "2",
    other_column_id: null,
    url: "https://example.com/2",
    tags: [{ name: "tag1" }, { name: "tag2" }],
    custom_tags: null,
    memo: "",
    title: "Sample Title2",
    is_in_other_table: false,
    articleId: null,
    createdAt: "2024-01-01T00:00:00Z",
    userId: "user-123",
  },
];

describe("EditGroup Component", () => {
  it("renders component", async () => {
    render(<GroupArticleList articles={mockArticles} />);
    expect(screen.getByTestId("MemoDisplay")).toBeInTheDocument();
    expect(screen.getAllByTestId("Article")).toHaveLength(2);
  });

  it("passes correct props to Article component first", async () => {
    render(<GroupArticleList articles={mockArticles} />);
    expect(Article).toHaveBeenCalled();
    const firstCallArgs = (Article as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.item).toEqual(mockArticle);
    expect(firstCallArgs.onSubmit).toBe(addStoredItemHistory);
  });

  it("passes correct props to SelectedArticleList component second", async () => {
    render(<GroupArticleList articles={mockArticles} />);
    expect(MemoDisplay).toHaveBeenCalled();
    const firstCallArgs = (MemoDisplay as jest.Mock).mock.calls[0][0];
    expect(firstCallArgs.item).toEqual(mockArticle);
    expect(firstCallArgs.displayDeleteButton).toEqual(false);
  });
});
