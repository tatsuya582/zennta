import { NotArticleError } from "@/components/layout/main/NotArticleError";
import { render, screen } from "@testing-library/react";

describe("NotArticleError Component", () => {
  test("should render with correct text", () => {
    render(<NotArticleError />);
    const textElement = screen.getByText(/記事がありません/i);
    expect(textElement).toBeInTheDocument();
  });
});
