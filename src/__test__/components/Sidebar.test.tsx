import Sidebar from "@/components/layout/sidebar/Sidebar";
import { render, screen } from "@testing-library/react";

describe("Header Component", () => {
  test("renders the history section with the correct text", () => {
    render(<Sidebar />);
    const historyHeading = screen.getByText(/履歴/i);
    expect(historyHeading).toBeInTheDocument();
  });
});
