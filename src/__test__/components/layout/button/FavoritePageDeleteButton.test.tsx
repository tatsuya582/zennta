import { render, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { updateFavoriteColumn, deleteFavorite } from "@/actions/favorite";
import { FavoritePageDeleteButton } from "@/components/layout/button/FavoritePageDeleteButton";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn(),
  })),
}));
jest.mock("@/actions/favorite", () => ({
  updateFavoriteColumn: jest.fn(),
  deleteFavorite: jest.fn(),
}));

describe("FavoritePageDeleteButton", () => {
  const mockRouter = {
    refresh: jest.fn(),
  };

  const mockToast = {
    toast: jest.fn(),
  };

  const mockItem = {
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

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue(mockToast);
  });

  it("renders correctly", () => {
    render(<FavoritePageDeleteButton item={mockItem} />);
    expect(screen.getByText("削除")).toBeInTheDocument();
  });

  it("opens and closes the dialog", () => {
    render(<FavoritePageDeleteButton item={mockItem} />);
    fireEvent.click(screen.getByText("削除"));
    expect(screen.getByText("削除してよろしいですか？")).toBeInTheDocument();

    fireEvent.click(screen.getByText("キャンセル"));
    expect(screen.queryByText("削除してよろしいですか？")).not.toBeInTheDocument();
  });

  it("calls deleteFavorite when not a memo", async () => {
    jest.useFakeTimers();
    (deleteFavorite as jest.Mock).mockResolvedValue(undefined);
    render(<FavoritePageDeleteButton item={mockItem} />);

    fireEvent.click(screen.getByText("削除"));
    const dialog = screen.getByRole("alertdialog");
    const dialogDeleteButton = within(dialog).getByText("削除");
    fireEvent.click(dialogDeleteButton);

    // deleteFavoriteが呼び出され、適切な引数が渡されたことを確認
    await waitFor(() => expect(deleteFavorite).toHaveBeenCalledWith(mockItem.column_id));

    // ページリフレッシュとトーストの表示を確認
    expect(mockRouter.refresh).toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: "削除しました",
      });
    });
  });

  it("calls updateFavoriteColumn when isMemo is true", async () => {
    jest.useFakeTimers();
    (updateFavoriteColumn as jest.Mock).mockResolvedValue(undefined);
    render(<FavoritePageDeleteButton item={mockItem} isMemo={true} />);

    fireEvent.click(screen.getByText("メモを削除"));
    fireEvent.click(screen.getByText("削除"));

    await waitFor(() => expect(updateFavoriteColumn).toHaveBeenCalledWith(mockItem.column_id, ""));
    expect(mockRouter.refresh).toHaveBeenCalled();
    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        description: "削除しました",
      });
    });
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("handles loading state", async () => {
    jest.useFakeTimers();
    render(<FavoritePageDeleteButton item={mockItem} />);
    fireEvent.click(screen.getByText("削除"));
    const dialog = screen.getByRole("alertdialog");
    const dialogDeleteButton = within(dialog).getByText("削除");
    fireEvent.click(dialogDeleteButton);

    const loadingButton = screen.getByRole("button", { name: "loading" });
    expect(loadingButton).toHaveAttribute("disabled");
  });

  it("handles errors gracefully", async () => {
    (deleteFavorite as jest.Mock).mockRejectedValue(new Error("Test error"));

    render(<FavoritePageDeleteButton item={mockItem} />);
    fireEvent.click(screen.getByText("削除"));
    const dialog = screen.getByRole("alertdialog");
    const dialogDeleteButton = within(dialog).getByText("削除");
    fireEvent.click(dialogDeleteButton);

    await waitFor(() => expect(deleteFavorite).toHaveBeenCalled());
    expect(mockToast.toast).not.toHaveBeenCalledWith({
      description: "削除しました",
    });
  });
});
