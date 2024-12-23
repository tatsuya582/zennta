import { render, screen } from "@testing-library/react";
import LoginPage, { metadata } from "@/app/login/page";

jest.mock("@/components/layout/form/AuthForm", () => ({
  AuthForm: jest.fn(({ type }) => <div data-testid="auth-form">{type}</div>),
}));

describe("LoginPage", () => {
  it("should render the page with correct components", async () => {
    render(<LoginPage />);

    expect(screen.getByTestId("auth-form")).toBeInTheDocument();
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("ログイン");
  });
});
