import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ZennSearchPagiNation } from "@/components/layout/pagiNation/ZennSearchPagiNation";
import { type ZennSearchPagiNationProps } from "@/types/types";

describe("ZennSearchPagiNation Component", () => {
  const mockBuildHref = (page: number) => `/page/${page}`;
  const defaultProps: ZennSearchPagiNationProps = {
    currentPage: 5,
    next: 6,
    buildHref: mockBuildHref,
  };

  it("renders the correct number of page links", () => {
    render(<ZennSearchPagiNation {...defaultProps} />);

    const pageLinks = screen.getAllByRole("link");
    expect(pageLinks).toHaveLength(7); // 1ページ目、前へ、2, 3, 4, 5 (currentPage)
  });

  it('renders "previous" and "next" buttons with correct href', () => {
    render(<ZennSearchPagiNation {...defaultProps} />);

    const previousLink = screen.getByRole("link", { name: "Go to previous page" });
    expect(previousLink).toHaveAttribute("href", mockBuildHref(defaultProps.currentPage - 1));

    const nextLink = screen.getByRole("link", { name: "Go to next page" });
    expect(nextLink).toHaveAttribute("href", mockBuildHref(defaultProps.currentPage + 1));
  });

  it("renders ellipsis when currentPage >= 5", () => {
    render(<ZennSearchPagiNation {...defaultProps} />);

    const ellipsis = document.querySelector(
      'span[aria-hidden="true"] > svg[xmlns="http://www.w3.org/2000/svg"] + span.sr-only'
    );
    expect(ellipsis).toBeInTheDocument();
  });

  it("does not render ellipsis when currentPage < 5", () => {
    render(<ZennSearchPagiNation {...defaultProps} currentPage={4} />);

    const ellipsis = document.querySelector(
      'span[aria-hidden="true"] > svg[xmlns="http://www.w3.org/2000/svg"] + span.sr-only'
    );
    expect(ellipsis).not.toBeInTheDocument();
  });

  it("renders the correct page links around currentPage", () => {
    render(<ZennSearchPagiNation {...defaultProps} />);

    expect(screen.getByText("4")).toHaveAttribute("href", mockBuildHref(4));
    expect(screen.getByText("3")).toHaveAttribute("href", mockBuildHref(3));
    expect(screen.getByText("2")).toHaveAttribute("href", mockBuildHref(2));

    const currentPageLink = screen.getByText(defaultProps.currentPage.toString());
    expect(currentPageLink).toHaveAttribute("aria-current", "page");
  });

  it('does not render "next" button when next is false', () => {
    render(<ZennSearchPagiNation {...defaultProps} next={null} />);

    const nextLink = screen.queryByRole("link", { name: "Go to next page" });
    expect(nextLink).not.toBeInTheDocument();
  });

  it("handles edge case when currentPage is 1", () => {
    render(<ZennSearchPagiNation {...defaultProps} currentPage={1} />);

    const previousLink = screen.queryByRole("link", { name: "Go to previous page" });
    expect(previousLink).not.toBeInTheDocument();

    const nextLink = screen.getByRole("link", { name: "Go to next page" });
    expect(nextLink).toHaveAttribute("href", mockBuildHref(2));
  });
});
