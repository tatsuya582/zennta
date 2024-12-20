import { Header } from "@/components/layout/header/Header";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/layout/header/AuthNavigation", () => ({
  AuthNavigation: () => <div>AuthNavigation</div>,
}));
jest.mock("@/components/layout/header/MobileNavigation", () => ({
  MobileNavigation: () => <div>MobileNavigation</div>,
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Header Component", () => {
  test("should display Zennta logo in the Header component", () => {
    render(<Header />);
    const logoElement = screen.getByText(/Zennta/i);
    expect(logoElement).toBeInTheDocument();
    expect(screen.getByText("AuthNavigation")).toBeInTheDocument();
    expect(screen.getByText("MobileNavigation")).toBeInTheDocument();
  });
});
