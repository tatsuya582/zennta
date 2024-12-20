import { Article } from "@/components/layout/main/Article";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Article Component", () => {
  const item = {
    id: "0001",
    url: "https://example.com",
    title: "Example Article",
    created_at: "2024-01-01",
    tags: [{ name: "tag1" }, { name: "tag2" }],
  };

  const mockOnSubmit = jest.fn();
  const mockRouterRefresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRouterRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the article title and link correctly", () => {
    render(<Article item={item} onSubmit={mockOnSubmit} />);

    const linkElement = screen.getByText("Example Article");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://example.com");
  });

  it("handles onSubmit and router.refresh when link is clicked", async () => {
    render(<Article item={item} onSubmit={mockOnSubmit} />);

    const linkElement = screen.getByText("Example Article");

    fireEvent.click(linkElement);

    expect(mockOnSubmit).toHaveBeenCalledWith(item);
    await expect(mockOnSubmit).resolves;
    expect(mockRouterRefresh).toHaveBeenCalled();
  });

  it("renders tags if displayTags is true", () => {
    render(<Article item={item} onSubmit={mockOnSubmit} displayTags={true} />);

    const tagElements = screen.getAllByRole("link");
    expect(tagElements).toHaveLength(3);
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
  });

  it("does not render tags if displayTags is false", () => {
    render(<Article item={item} onSubmit={mockOnSubmit} displayTags={false} />);

    const tagElements = screen.queryByText("tag1");
    expect(tagElements).not.toBeInTheDocument();
  });

  it("does not render tags if displayTags is false", () => {
    const item = {
      id: "0001",
      url: "https://example.com",
      title: "Example Article",
      created_at: "2024-01-01",
      tags: null,
    };
    render(<Article item={item} onSubmit={mockOnSubmit} />);

    const tagElements = screen.queryByText("tag1");
    expect(tagElements).not.toBeInTheDocument();
  });
});
