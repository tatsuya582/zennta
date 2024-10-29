import AuthNavigation from "@/components/layout/header/AuthNavigation";
import { getUser } from "@/lib/auth/getUser/server";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/auth/getUser/server", () => ({
  getUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
})

describe("AuthNavigation Component", () => {
  test("should display login screen when AuthNavigation is called with no user logged in", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(null);
    const ui = await AuthNavigation();
    render(ui);
    const login = screen.getByText(/ログイン/i);
    expect(login).toBeInTheDocument();
  });

  test("should display navigation links when AuthNavigation is called with no user logged in", async () => {
    (getUser as jest.Mock).mockResolvedValueOnce(null);
    const ui = await AuthNavigation();
    render(ui);
    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBeGreaterThan(0);
  });

  test("should display logout button when AuthNavigation is called with a logged-in user", async () => {
    // 元の console.error と console.warn を保存
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // console.error と console.warn をモックして無効化
    console.error = jest.fn();
    console.warn = jest.fn();

    (getUser as jest.Mock).mockResolvedValueOnce({ id: "test" });
    const ui = await AuthNavigation();
    render(ui);
    const logout = screen.getByText(/ログアウト/i);
    expect(logout).toBeInTheDocument();

    // テストが終了したら元に戻す
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });
});
