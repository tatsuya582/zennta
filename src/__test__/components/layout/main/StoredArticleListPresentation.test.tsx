import { render, screen } from "@testing-library/react";
import { FetchedArticles } from "@/types/databaseCustom.types";
import StoredArticleListPresentation from "@/components/layout/main/StoredArticleListPresentation";

jest.mock("@/actions/history", () => ({
  addStoredItemHistory: jest.fn(),
}));
jest.mock("@/components/layout/button/AddFavoriteColumnButton", () => ({
  AddFavoriteColumnButton: ({ item, isEdit }: { item: any; isEdit?: boolean }) => (
    <button>{isEdit ? `Edit Favorite: ${item.id}` : `Add Favorite: ${item.id}`}</button>
  ),
}));
jest.mock("@/components/layout/button/FavoritePageDeleteButton", () => ({
  FavoritePageDeleteButton: ({ item }: { item: any }) => <button>Delete Favorite: {item.id}</button>,
}));
jest.mock("@/components/layout/button/ReadLaterPageButton", () => ({
  ReadLaterPageButton: ({ item }: { item: any }) => <button>Read Later: {item.id}</button>,
}));
jest.mock("@/components/layout/main/Article", () => ({
  Article: ({ item }: { item: any }) => <div>Article: {item.title}</div>,
}));
jest.mock("@/components/layout/memo/MemoDisplay", () => ({
  MemoDisplay: ({ item }: { item: any }) => <div>Memo: {item.memo}</div>,
}));

describe("StoredArticleListPresentation", () => {
  const paginationMock = <div>Pagination</div>;
  const mockArticles = [
    {
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
    },
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

  it("renders articles and pagination correctly", () => {
    render(<StoredArticleListPresentation pagination={paginationMock} articles={mockArticles} isFavorite={false} />);

    expect(screen.getAllByText("Pagination")).toHaveLength(2);

    expect(screen.getByText("Article: Sample Title1")).toBeInTheDocument();
    expect(screen.getByText("Article: Sample Title2")).toBeInTheDocument();

    expect(screen.getByText("Memo: This is a memo1")).toBeInTheDocument();
    expect(screen.getAllByText(/Memo:/)).toHaveLength(1);

    expect(screen.getByText("Read Later: 1")).toBeInTheDocument();
    expect(screen.getByText("Read Later: 2")).toBeInTheDocument();
  });

  it("renders favorite-related buttons when isFavorite is true", () => {
    render(<StoredArticleListPresentation pagination={paginationMock} articles={mockArticles} isFavorite={true} />);

    expect(screen.getByText("Edit Favorite: 1")).toBeInTheDocument();
    expect(screen.getByText("Add Favorite: 2")).toBeInTheDocument();

    expect(screen.getByText("Delete Favorite: 1")).toBeInTheDocument();
    expect(screen.getByText("Delete Favorite: 2")).toBeInTheDocument();
  });
});
