import FavoriteGroupCreatePage, { metadata } from "@/app/favorite/create/page";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/layout/group/CreateGroup", () => ({
  CreateGroup: jest.fn(() => <div data-testid="create-group" />),
}));

describe("FavoriteGroupCreatePage", () => {
  it("should render the page with correct components and elements", () => {
    render(<FavoriteGroupCreatePage />);

    expect(screen.getByRole("heading", { level: 2, name: "お気に入りグループ作成" })).toBeInTheDocument();
    expect(screen.getByTestId("create-group")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /戻る/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/favorite");
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("お気に入りグループ作成");
  });
});
