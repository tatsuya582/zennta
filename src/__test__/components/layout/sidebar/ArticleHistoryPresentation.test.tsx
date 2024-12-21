import { render, screen } from "@testing-library/react";
import { ArticleHistoryPresentation } from "@/components/layout/sidebar/ArticleHistoryPresentation";
import { StoredItem } from "@/types/types";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

jest.mock("@/components/layout/main/Article", () => ({
  Article: ({ item }: { item: StoredItem }) => <div data-testid="article">{item.title}</div>,
}));

jest.mock("@/components/layout/button/ActionButton", () => ({
  ActionButton: ({ tableName, isTable }: { tableName: "readLater" | "favorite"; isTable: boolean }) => (
    <button data-testid={`action-button-${tableName}`}>
      {isTable ? "Delete from " + tableName : "Add to " + tableName}
    </button>
  ),
}));

describe("ArticleHistoryPresentation Component", () => {
  test("renders '履歴がありません' when history is null", () => {
    render(<ArticleHistoryPresentation history={null} readLaterUrls={new Map()} favoriteUrls={new Map()} />);
    expect(screen.getByText("履歴がありません")).toBeInTheDocument();
  });

  test("renders articles and action buttons when history is provided", () => {
    const mockHistory = [
      {
        updatedAt: "2024-12-21T12:00:00Z",
        articles: {
          id: "1",
          url: "https://example.com/article1",
          tags: [
            { id: "t1", name: "Tag1" },
            { id: "t2", name: "Tag2" },
          ],
          title: "Article 1",
        },
      },
      {
        updatedAt: "2024-12-20T15:30:00Z",
        articles: {
          id: "2",
          url: "https://example.com/article2",
          tags: null,
          title: "Article 2",
        },
      },
    ];

    const mockReadLaterUrls = new Map([["https://example.com/article1", "1"]]);
    const mockFavoriteUrls = new Map([["https://example.com/article2", "2"]]);

    render(
      <ArticleHistoryPresentation
        history={mockHistory}
        readLaterUrls={mockReadLaterUrls}
        favoriteUrls={mockFavoriteUrls}
      />
    );

    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();

    const readLaterButtons = screen.getAllByTestId("action-button-readLater");
    const favoriteButtons = screen.getAllByTestId("action-button-favorite");

    expect(readLaterButtons[0]).toHaveTextContent("Delete from readLater");
    expect(favoriteButtons[1]).toHaveTextContent("Delete from favorite");
  });

  test("renders add action buttons for missing items in readLater or favorite", () => {
    const mockHistory = [
      {
        updatedAt: "2024-12-21T12:00:00Z",
        articles: {
          id: "1",
          url: "https://example.com/article1",
          tags: [
            { id: "t1", name: "Tag1" },
            { id: "t2", name: "Tag2" },
          ],
          title: "Article 1",
        },
      },
    ];
    const mockReadLaterUrls = new Map();
    const mockFavoriteUrls = new Map();

    render(
      <ArticleHistoryPresentation
        history={mockHistory}
        readLaterUrls={mockReadLaterUrls}
        favoriteUrls={mockFavoriteUrls}
      />
    );

    const readLaterButton = screen.getByTestId("action-button-readLater");
    const favoriteButton = screen.getByTestId("action-button-favorite");

    expect(readLaterButton).toHaveTextContent("Add to readLater");
    expect(favoriteButton).toHaveTextContent("Add to favorite");
  });
});
