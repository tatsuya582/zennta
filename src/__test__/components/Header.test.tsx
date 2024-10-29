import AuthNavigation from "@/components/layout/header/AuthNavigation";
import MobileNavigation from "@/components/layout/header/MobileNavigation";
import Header from "@/components/layout/header/Header";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/layout/header/AuthNavigation", () => ({
  __esModule: true,
  default: jest.fn(() => {<div></div>})
}));

jest.mock("@/components/layout/header/MobileNavigation", () => ({
  __esModule: true,
  default: jest.fn(() => {<div></div>})
}));

beforeEach(() => {
  jest.clearAllMocks();
})

describe("Header Component", () => {
  test("should display Zennta logo in the Header component", () => {
    render(<Header />);
    const logoElement = screen.getByText(/Zennta/i);
    expect(logoElement).toBeInTheDocument();
  });
});
