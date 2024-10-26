import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("Home Page Section", () => {
  test("displays the correct headings for Qiita and Zenn sections", () => {
    render(<Home />);
    const qiitaHeading = screen.getByText(/Qiita一覧/i);
    const zennHeading = screen.getByText(/Zenn一覧/i);
    expect(qiitaHeading).toBeInTheDocument();
    expect(zennHeading).toBeInTheDocument();
  });
});
