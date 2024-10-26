import Header from "@/components/layout/header/Header";
import { render, screen } from "@testing-library/react";

describe("Header Component", () => {
  test("renders the logo with the correct text", () => {
    render(<Header />);
    const logoElement = screen.getByText(/Zennta/i);
    expect(logoElement).toBeInTheDocument();
  });

  test("renders navigation links correctly", () => {
    render(<Header />);
    const navLinks = screen.getAllByRole("link");
    expect(navLinks.length).toBeGreaterThan(0);
  });
});
