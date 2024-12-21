import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import React from "react";

jest.mock("@/components/layout/sidebar/ArticleHistory", () => ({
  ArticleHistory: () => <div data-testid="article-history">Mocked ArticleHistory</div>,
}));

describe("Sidebar Component", () => {
  test("renders the sidebar with the correct structure", () => {
    render(<Sidebar />);

    const asideElement = screen.getByRole("complementary", { name: /履歴/i });
    expect(asideElement).toBeInTheDocument();

    const header = screen.getByText("履歴");
    expect(header).toBeInTheDocument();

    const articleHistory = screen.getByTestId("article-history");
    expect(articleHistory).toBeInTheDocument();
  });

  test("does not render the sidebar in non-md screens (hidden class)", () => {
    render(<Sidebar />);

    const asideElement = screen.getByRole("complementary", { name: /履歴/i });
    expect(asideElement).toHaveClass("hidden");
  });
});
