import { Footer } from "@/components/layout/footer/Footer";
import { render, screen } from "@testing-library/react";

describe("Footer Component", () => {
  test("should display Footer component", () => {
    render(<Footer />);

    const contactLink = screen.getByText("お問い合わせフォーム");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", process.env.NEXT_PUBLIC_FORM_URL!);

    const termsServiceLink = screen.getByText("利用規約");
    expect(termsServiceLink).toBeInTheDocument();
    expect(termsServiceLink).toHaveAttribute("href", "/terms");

    const privacyPolicyLink = screen.getByText("プライバシーポリシー");
    expect(privacyPolicyLink).toBeInTheDocument();
    expect(privacyPolicyLink).toHaveAttribute("href", "/privacy");
  });
});
