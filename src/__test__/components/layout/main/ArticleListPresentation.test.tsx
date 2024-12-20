import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { deleteFavorite } from "@/actions/favorite";
import { addreadLater } from "@/actions/readLater";
import ArticleListPresentation from "@/components/layout/main/ArticleListPresentation";

jest.mock("@/actions/favorite", () => ({
  addFavorite: jest.fn(),
  deleteFavorite: jest.fn(),
}));

jest.mock("@/actions/history", () => ({
  addHistory: jest.fn(),
}));

jest.mock("@/actions/readLater", () => ({
  addreadLater: jest.fn(),
  deleteReadLater: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    refresh: jest.fn(),
    push: jest.fn(),
  }),
}));

describe("ArticleListPresentation Component", () => {
  const mockPagination = <div>Pagination</div>;
  const mockArticles = [
    {
      id: "1",
      url: "https://example.com/1",
      title: "Article 1",
      created_at: "2024-01-01",
      tags: [{ name: "tag1" }, { name: "tag2" }],
    },
    {
      id: "2",
      url: "https://example.com/2",
      title: "Article 2",
      created_at: "2024-01-01",
      tags: [{ name: "tag1" }, { name: "tag2" }],
    },
  ];
  const mockReadLaterUrls = new Map([["https://example.com/1", "1"]]);
  const mockFavoriteUrls = new Map([["https://example.com/2", "2"]]);

  it("renders pagination and articles correctly", async () => {
    render(
      <ArticleListPresentation
        pagination={mockPagination}
        articles={mockArticles}
        readLaterUrls={mockReadLaterUrls}
        favoriteUrls={mockFavoriteUrls}
        isLogin={false}
      />
    );
    const paginations = screen.getAllByText("Pagination");

    expect(paginations[0]).toBeInTheDocument();
    expect(paginations[1]).toBeInTheDocument();

    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();
  });

  it("does not show action buttons when not logged in", async () => {
    render(
      <ArticleListPresentation
        pagination={mockPagination}
        articles={mockArticles}
        readLaterUrls={mockReadLaterUrls}
        favoriteUrls={mockFavoriteUrls}
        isLogin={false}
      />
    );
    expect(screen.queryByText(/後で読む/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/お気に入り登録/i)).not.toBeInTheDocument();
  });

  it("shows action buttons when logged in", async () => {
    render(
      <ArticleListPresentation
        pagination={mockPagination}
        articles={mockArticles}
        readLaterUrls={mockReadLaterUrls}
        favoriteUrls={mockFavoriteUrls}
        isLogin={true}
      />
    );
    expect(screen.getByText(/後で読む/i)).toBeInTheDocument();
    expect(screen.getByText(/お気に入り登録/i)).toBeInTheDocument();
    expect(screen.getByText(/登録済み/i)).toBeInTheDocument();
    expect(screen.getByText(/お気に入り済み/i)).toBeInTheDocument();
  });

  it("calls the correct actions on button click", async () => {
    render(
      <ArticleListPresentation
        pagination={mockPagination}
        articles={mockArticles}
        readLaterUrls={mockReadLaterUrls}
        favoriteUrls={mockFavoriteUrls}
        isLogin={true}
      />
    );
    const readLaterButton = screen.getByText(/後で読む/i);
    const favoriteButton = screen.getByText(/お気に入り済み/i);

    fireEvent.click(readLaterButton);
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(addreadLater).toHaveBeenCalledWith(mockArticles[1]);
      expect(deleteFavorite).toHaveBeenCalledWith("2");
    });
  });
});
