import { addFavoriteByUrl } from "@/actions/favorite";
import { AddArticleForm } from "@/components/layout/form/AddArticleForm";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/actions/favorite", () => ({
  addFavoriteByUrl: jest.fn(),
}));

describe("SearchForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input and button elements correctly", () => {
    render(<AddArticleForm addAction={addFavoriteByUrl} />);
    expect(screen.getByPlaceholderText("追加したいURLを入力")).toBeInTheDocument();
    expect(screen.getByText("追加")).toBeInTheDocument();
  });

  it("updates the input value when the user types", () => {
    render(<AddArticleForm addAction={addFavoriteByUrl} />);
    const input = screen.getByPlaceholderText("追加したいURLを入力");
    fireEvent.change(input, { target: { value: "new url" } });
    expect(input).toHaveValue("new url");
  });

  it("If the URL is empty, the button cannot be pressed", () => {
    render(<AddArticleForm addAction={addFavoriteByUrl} />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(addFavoriteByUrl).not.toHaveBeenCalled();
  });

  it("handles form submission and sets loading state correctly", () => {
    render(<AddArticleForm addAction={addFavoriteByUrl} />);
    const input = screen.getByPlaceholderText("追加したいURLを入力");
    const button = screen.getByText("追加");

    fireEvent.change(input, { target: { value: "new url" } });
    fireEvent.submit(screen.getByRole("form"));

    expect(button).toHaveAttribute("disabled");
  });
});
