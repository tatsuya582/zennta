import { render, screen, fireEvent } from "@testing-library/react";
import { signinWithOAuthAction } from "@/lib/auth/login";
import { AuthForm } from "@/components/layout/form/AuthForm";

jest.mock("@/lib/auth/login", () => ({
  signinWithOAuthAction: jest.fn(),
}));

describe("AuthForm", () => {
  test("renders login form correctly", () => {
    render(<AuthForm type="login" />);

    expect(screen.getByText("ログイン")).toBeInTheDocument();

    const githubButton = screen.getByText("GitHubでログイン");
    const googleButton = screen.getByText("Googleでログイン");
    const twitterButton = screen.getByText("Xでログイン");

    expect(githubButton).toBeInTheDocument();
    expect(googleButton).toBeInTheDocument();
    expect(twitterButton).toBeInTheDocument();

    fireEvent.click(githubButton);
    expect(signinWithOAuthAction).toHaveBeenCalledWith("github");

    fireEvent.click(googleButton);
    expect(signinWithOAuthAction).toHaveBeenCalledWith("google");

    fireEvent.click(twitterButton);
    expect(signinWithOAuthAction).toHaveBeenCalledWith("twitter");
  });

  test("renders registration form correctly", () => {
    render(<AuthForm type="register" />);

    expect(screen.getByText("会員登録")).toBeInTheDocument();

    const githubButton = screen.getByText("GitHubで会員登録");
    const googleButton = screen.getByText("Googleで会員登録");
    const twitterButton = screen.getByText("Xで会員登録");

    expect(githubButton).toBeInTheDocument();
    expect(googleButton).toBeInTheDocument();
    expect(twitterButton).toBeInTheDocument();

    fireEvent.click(githubButton);
    expect(signinWithOAuthAction).toHaveBeenCalledWith("github");

    fireEvent.click(googleButton);
    expect(signinWithOAuthAction).toHaveBeenCalledWith("google");

    fireEvent.click(twitterButton);
    expect(signinWithOAuthAction).toHaveBeenCalledWith("twitter");
  });
});
