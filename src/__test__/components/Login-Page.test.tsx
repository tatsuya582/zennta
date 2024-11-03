import LoginPage from "@/app/login/page";
import { render, screen } from "@testing-library/react";

describe("LoginPage Component", () => {
  test("render Login form correctly", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /GitHubでログイン/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Googleでログイン/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Xでログイン/i })).toBeInTheDocument();
  });
});
