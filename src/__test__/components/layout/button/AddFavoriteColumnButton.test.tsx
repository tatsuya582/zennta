import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useFavoriteMemoForm } from "@/components/layout/form/useFavoriteMemoForm";
import { AddFavoriteColumnButton } from "@/components/layout/button/AddFavoriteColumnButton";
import { type FetchedArticles } from "@/types/databaseCustom.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({ children }: { children: React.ReactNode }) => (
    <div>
      <label htmlFor="mock-textarea">Label</label>
      <textarea id="mock-textarea" />
      {children}
    </div>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormMessage: () => <div />,
}));

jest.mock("@/components/layout/form/useFavoriteMemoForm");

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

const formSchema = z.object({
  value: z.string().max(280, {
    message: "メモは280文字以下にしてください",
  }),
});

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

describe("AddFavoriteColumnButton", () => {
  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      control: {},
      handleSubmit: jest.fn((fn) => fn),
      watch: jest.fn(),
      reset: jest.fn(),
    });

    (useFavoriteMemoForm as jest.Mock).mockReturnValue({
      form: useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          value: "",
        },
      }),
      onSubmit: jest.fn(),
      isLoading: false,
    });
  });

  it("opens the dialog when button is clicked", () => {
    render(<AddFavoriteColumnButton item={mockItem} />);
    const button = screen.getByRole("button", { name: "メモを追加" });

    fireEvent.click(button);

    expect(screen.getByText("メモを入力してください")).toBeInTheDocument();
  });

  it("calls onSubmit when the form is submitted", async () => {
    render(<AddFavoriteColumnButton item={mockItem} />);
    const button = screen.getByRole("button", { name: "メモを追加" });

    fireEvent.click(button);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test Memo" } });

    const submitButton = screen.getByText("追加");
    // JSDOM が HTMLFormElement.prototype.requestSubmitをサポートしていないので下のようにやる
    const form = submitButton.closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect((useFavoriteMemoForm as jest.Mock).mock.results[0].value.onSubmit).toHaveBeenCalled();
    });
  });

  it("closes the dialog when cancel button is clicked", () => {
    render(<AddFavoriteColumnButton item={mockItem} />);
    const button = screen.getByRole("button", { name: "メモを追加" });

    fireEvent.click(button);

    const cancelButton = screen.getByRole("button", { name: "キャンセル" });
    fireEvent.click(cancelButton);

    expect(screen.queryByText("メモを入力してください")).not.toBeInTheDocument();
  });

  it("calls onSubmit with edited memo when isEdit is true", async () => {
    render(<AddFavoriteColumnButton item={mockItem} isEdit />);
    const button = screen.getByRole("button", { name: "メモを編集" });

    fireEvent.click(button);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Test Memo" } });

    const submitButton = screen.getByText("編集");
    const form = submitButton.closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect((useFavoriteMemoForm as jest.Mock).mock.results[0].value.onSubmit).toHaveBeenCalled();
    });
  });
});
