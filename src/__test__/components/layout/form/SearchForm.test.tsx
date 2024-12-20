import { SearchForm } from "@/components/layout/form/SearchForm";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SearchForm", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the input and button elements correctly", () => {
    render(<SearchForm linkPage="search" />);
    expect(screen.getByPlaceholderText("検索ワードを入力")).toBeInTheDocument();
    expect(screen.getByText("検索")).toBeInTheDocument();
  });

  it("sets the initial input value based on the query prop", () => {
    render(<SearchForm query="test" linkPage="search" />);
    expect(screen.getByPlaceholderText("検索ワードを入力")).toHaveValue("test");
  });

  it("updates the input value when the user types", () => {
    render(<SearchForm linkPage="search" />);
    const input = screen.getByPlaceholderText("検索ワードを入力");
    fireEvent.change(input, { target: { value: "new query" } });
    expect(input).toHaveValue("new query");
  });

  it("does not call router.push when the input value matches the query prop", () => {
    render(<SearchForm query="test" linkPage="search" />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls router.push with the correct URL when the form is submitted", () => {
    render(<SearchForm linkPage="search" />);
    const input = screen.getByPlaceholderText("検索ワードを入力");
    fireEvent.change(input, { target: { value: "new query" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockPush).toHaveBeenCalledWith("/search?query=new%20query");
  });

  it("displays the '検索' heading and placeholder text when isNoQuery is true", () => {
    render(<SearchForm isNoQuery={true} linkPage="search" />);
    expect(screen.getByTestId("search-heading")).toBeInTheDocument();
    expect(screen.getByText("なにか入力してください")).toBeInTheDocument();
  });

  it("handles form submission and sets loading state correctly", () => {
    render(<SearchForm linkPage="search" />);
    const input = screen.getByPlaceholderText("検索ワードを入力");
    const button = screen.getByText("検索");

    fireEvent.change(input, { target: { value: "new query" } });
    fireEvent.submit(screen.getByRole("form"));

    expect(button).toHaveAttribute("disabled");
  });
});
