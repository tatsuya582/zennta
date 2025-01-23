import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";

jest.mock("@/components/layout/sidebar/Sidebar", () => ({
  Sidebar: jest.fn(() => <div data-testid="sidebar" />),
}));

jest.mock("@/components/layout/header/Header", () => ({
  Header: jest.fn(() => <div data-testid="header" />),
}));

jest.mock("@/components/ui/toaster", () => ({
  Toaster: jest.fn(() => <div data-testid="toaster" />),
}));

jest.mock("@vercel/analytics/next", () => ({
  Analytics: jest.fn(() => <div data-testid="analytics" />),
}));

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the page with correct components and elements", () => {
    const mockChildren = <div>test-children</div>;
    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByTestId("analytics")).toBeInTheDocument();
    expect(screen.getByText("test-children")).toBeInTheDocument();
  });

  it("should have correct title and description in metadata", () => {
    const title = { default: "Zennta", template: "%s | Zennta" };
    const description =
      "ZennやQiitaのAPIを利用して記事一覧や検索を同時にできるサービスです。読んだ履歴や後で読む、お気に入りなどができます。";
    expect(metadata.title).toStrictEqual(title);
    expect(metadata.description).toBe(description);
  });
});
