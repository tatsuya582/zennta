import { ActionButton } from "@/components/layout/button/ActionButton";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ActionButton Component", () => {
  const testItem = { id: "1", title: "Sample Item", url: "http://example.com", tags: null, created_at: "2024-01-01" };
  const mockRouter = {
    refresh: jest.fn(),
  };
  const mockAddAction = jest.fn();
  const mockDeleteAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should display '後で読む' when isTable is false", () => {
    render(
      <ActionButton
        item={testItem}
        id={null}
        isTable={false}
        tableName="readLater"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    expect(screen.getByText("後で読む")).toBeInTheDocument();
  });

  it("should display 'お気に入り登録' when isTable is false", () => {
    render(
      <ActionButton
        item={testItem}
        id={null}
        isTable={false}
        tableName="favorite"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    expect(screen.getByText("お気に入り登録")).toBeInTheDocument();
  });

  it("should call addAction and refresh the page when '後で読む' is clicked", async () => {
    mockAddAction.mockResolvedValue("123");
    render(
      <ActionButton
        item={testItem}
        id={null}
        isTable={false}
        tableName="readLater"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    const addButton = screen.getByText("後で読む");
    fireEvent.click(addButton);

    expect(mockAddAction).toHaveBeenCalledWith({
      id: "1",
      title: "Sample Item",
      url: "http://example.com",
      tags: null,
      created_at: "2024-01-01",
    });

    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
  });

  it("should display '登録済み' when isTable is true", () => {
    render(
      <ActionButton
        item={testItem}
        id="123"
        isTable={true}
        tableName="readLater"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    expect(screen.getByText("登録済み")).toBeInTheDocument();
  });

  it("should call deleteAction and refresh the page when '登録済み' is clicked", async () => {
    jest.useFakeTimers();
    mockDeleteAction.mockResolvedValue(undefined);
    const { container } = render(
      <ActionButton
        item={testItem}
        id="123"
        isTable={true}
        tableName="readLater"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    const deleteButton = screen.getByText("登録済み");
    fireEvent.click(deleteButton);

    expect(mockDeleteAction).toHaveBeenCalledWith("123");

    await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());

    await waitFor(() => {
      const loadingButton = screen.getByRole("button", { name: "loading" });
      expect(loadingButton).toHaveAttribute("disabled");
    });

    jest.advanceTimersByTime(2000); //タイムアウトになってしまうので追加

    await waitFor(() => {
      expect(screen.queryByText("後で読む")).toBeInTheDocument();
    });
  });

  it("should handle errors gracefully when addAction fails", async () => {
    mockAddAction.mockRejectedValue(new Error("Add action failed"));
    render(
      <ActionButton
        item={testItem}
        id={null}
        isTable={false}
        tableName="readLater"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    const addButton = screen.getByText("後で読む");
    fireEvent.click(addButton);

    await waitFor(() => {
      const button = screen.queryByText("後で読む");
      expect(button).toBeInTheDocument();
    });
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully when deleteAction fails", async () => {
    mockDeleteAction.mockRejectedValue(new Error("Delete action failed"));
    render(
      <ActionButton
        item={testItem}
        id="123"
        isTable={true}
        tableName="readLater"
        deleteAction={mockDeleteAction}
        addAction={mockAddAction}
      />
    );

    const deleteButton = screen.getByText("登録済み");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText("登録済み")).toBeInTheDocument();
    });
    expect(mockRouter.refresh).not.toHaveBeenCalled();
  });
});
