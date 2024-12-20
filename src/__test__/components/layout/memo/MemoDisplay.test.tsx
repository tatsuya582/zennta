import { render, screen } from "@testing-library/react";
import { FetchedArticles } from "@/types/databaseCustom.types";
import { MemoDisplay } from "@/components/layout/memo/MemoDisplay";

jest.mock("@/components/layout/button/FavoritePageDeleteButton", () => ({
  FavoritePageDeleteButton: ({ item }: { item: any }) => <button>Delete Favorite: {item.id}</button>,
}));

const mockItem: FetchedArticles = {
  id: "1",
  column_id: "1",
  other_column_id: null,
  url: "https://example.com",
  tags: null,
  custom_tags: null,
  memo: "This is a memo",
  title: "Sample Title",
  is_in_other_table: false,
  articleId: null,
  createdAt: "2024-01-01T00:00:00Z",
  userId: "user-123",
};

describe("MemoDisplay", () => {
  it("renders memo and delete button correctly", () => {
    render(<MemoDisplay item={mockItem} />);
    expect(screen.getByText("This is a memo")).toBeInTheDocument();

    expect(screen.getByText("Delete Favorite: 1")).toBeInTheDocument();
  });
});
