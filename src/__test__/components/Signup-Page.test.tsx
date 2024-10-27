import SignupPage from "@/app/signup/page"
import { render, screen } from "@testing-library/react"

describe("SignupPage Component", () => {
  test("render Signup form correctly", () => {
    render(<SignupPage />);
    expect(screen.getByRole("button", { name: /GitHubで会員登録/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Googleで会員登録/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Xで会員登録/i })).toBeInTheDocument();
  })
})