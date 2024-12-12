import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { deleteReadLater } from "@/actions/readLater";
import { addStoredFavorite } from "@/actions/favorite";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ReadLaterPageButton } from "@/components/layout/button/ReadLaterPageButton";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

jest.mock("@/actions/readLater", () => ({
  deleteReadLater: jest.fn(),
}));

jest.mock("@/actions/favorite", () => ({
  addStoredFavorite: jest.fn(),
}));

describe("ReadLaterPageButton", () => {
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

  it("opens the dialog when '読了' button is clicked", () => {
    render(<ReadLaterPageButton item={mockItem} />);

    fireEvent.click(screen.getByRole("button", { name: "読了" }));

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("読み終わりましたか？")).toBeInTheDocument();
  });

  it("calls addStoredFavorite when 'お気に入り登録' is clicked", async () => {
    (addStoredFavorite as jest.Mock).mockResolvedValue("favorite-id");

    render(<ReadLaterPageButton item={mockItem} />);

    fireEvent.click(screen.getByRole("button", { name: "読了" }));

    const dialog = screen.getByRole("alertdialog");
    const favoriteButton = within(dialog).getByText("お気に入り登録");

    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(addStoredFavorite).toHaveBeenCalledWith(mockItem);
    });

    expect(mockToast.toast).toHaveBeenCalledWith({
      description: "お気に入り登録しました",
    });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("calls deleteReadLater when '削除' is clicked", async () => {
    (deleteReadLater as jest.Mock).mockResolvedValue(undefined);

    render(<ReadLaterPageButton item={mockItem} />);

    fireEvent.click(screen.getByRole("button", { name: "読了" }));

    const dialog = screen.getByRole("alertdialog");
    const deleteButton = within(dialog).getByText("削除");

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteReadLater).toHaveBeenCalledWith(mockItem.column_id);
    });

    expect(mockToast.toast).toHaveBeenCalledWith({
      description: "削除しました",
    });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes the dialog when 'キャンセル' is clicked", () => {
    render(<ReadLaterPageButton item={mockItem} />);

    fireEvent.click(screen.getByRole("button", { name: "読了" }));

    const dialog = screen.getByRole("alertdialog");
    const cancelButton = within(dialog).getByText("キャンセル");

    fireEvent.click(cancelButton);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("handles errors when 'お気に入り登録' fails", async () => {
    (addStoredFavorite as jest.Mock).mockRejectedValue(new Error("Favorite registration failed"));

    render(<ReadLaterPageButton item={mockItem} />);

    fireEvent.click(screen.getByRole("button", { name: "読了" }));

    const dialog = screen.getByRole("alertdialog");
    const favoriteButton = within(dialog).getByText("お気に入り登録");

    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(addStoredFavorite).toHaveBeenCalledWith(mockItem);
    });

    expect(mockToast.toast).not.toHaveBeenCalledWith({
      description: "お気に入り登録しました",
    });
  });

  it("handles errors when '削除' fails", async () => {
    (deleteReadLater as jest.Mock).mockRejectedValue(new Error("Deletion failed"));

    render(<ReadLaterPageButton item={mockItem} />);

    fireEvent.click(screen.getByRole("button", { name: "読了" }));

    const dialog = screen.getByRole("alertdialog");
    const deleteButton = within(dialog).getByText("削除");

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteReadLater).toHaveBeenCalledWith(mockItem.column_id);
    });

    expect(mockToast.toast).not.toHaveBeenCalledWith({
      description: "削除しました",
    });
  });
});
