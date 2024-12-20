import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { MainNavigation } from "@/components/layout/header/MainNavigation";
import { getUser } from "@/actions/user";

jest.mock("@/actions/user", () => ({
  getUser: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("MainNavigation", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/",
    });
  });

  it("should render navigation links", () => {
    (getUser as jest.Mock).mockResolvedValueOnce({ name: "test" });
    render(<MainNavigation />);

    const searchLink = screen.getByText("検索");
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute("href", "/search");

    const readLaterLink = screen.getByText("後で読む");
    expect(readLaterLink).toBeInTheDocument();
    expect(readLaterLink).toHaveAttribute("href", "/readlater");

    const favoriteLink = screen.getByText("お気に入り");
    expect(favoriteLink).toBeInTheDocument();
    expect(favoriteLink).toHaveAttribute("href", "/favorite");
  });
});
