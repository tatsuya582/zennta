import { render, screen } from "@testing-library/react";
import SignupPage, { metadata } from "@/app/signup/page";

jest.mock("@/components/layout/form/AuthForm", () => ({
  AuthForm: jest.fn(({ type }) => <div data-testid="auth-form">{type}</div>),
}));

describe("SignupPage", () => {
  it("should render the page with correct components", () => {
    render(<SignupPage />);

    expect(screen.getByTestId("auth-form")).toBeInTheDocument();
    expect(screen.getByText("signup")).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    expect(metadata.title).toBe("会員登録");
  });
});
