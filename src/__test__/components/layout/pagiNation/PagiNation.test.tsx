import { render, screen } from "@testing-library/react";
import { PagiNation } from "@/components/layout/pagiNation/PagiNation";
import { type PagiNationProps } from "@/types/types";

describe("PagiNation Component", () => {
  const mockBuildHref = (page: number) => `/page/${page}`;
  const defaultProps: PagiNationProps = {
    currentPage: 3,
    totalPage: 100,
    buildHref: mockBuildHref,
  };

  it("renders the correct number of page links including ellipsis", () => {
    render(<PagiNation {...defaultProps} />);

    const pageLinks = screen.getAllByRole("link");
    expect(pageLinks).toHaveLength(7);
  });

  it("displays the correct href for each page link", () => {
    render(<PagiNation {...defaultProps} />);

    expect(screen.getByText("2")).toHaveAttribute("href", mockBuildHref(2));
    expect(screen.getByText("3")).toHaveAttribute("href", mockBuildHref(3));
    expect(screen.getByText("4")).toHaveAttribute("href", mockBuildHref(4));
  });

  it("highlights the current page link", () => {
    render(<PagiNation {...defaultProps} />);

    const currentPageLink = screen.getByText(defaultProps.currentPage.toString());
    expect(currentPageLink).toHaveAttribute("aria-current", "page");
  });

  it("renders the previous and next buttons with correct href", () => {
    render(<PagiNation {...defaultProps} />);

    const previousLink = screen.getByRole("link", { name: "Go to previous page" });
    const nextLink = screen.getByRole("link", { name: "Go to next page" });
    expect(previousLink).toHaveAttribute("href", mockBuildHref(defaultProps.currentPage - 1));
    expect(nextLink).toHaveAttribute("href", mockBuildHref(defaultProps.currentPage + 1));
  });

  it("renders ellipsis correctly for middle pages", () => {
    render(<PagiNation {...defaultProps} />);

    const ellipsis = document.querySelector(
      'span[aria-hidden="true"] > svg[xmlns="http://www.w3.org/2000/svg"] + span.sr-only'
    );
    expect(ellipsis).toBeInTheDocument();
  });

  it("handles the edge case when on the first page", () => {
    render(<PagiNation {...defaultProps} currentPage={1} />);

    const previousLink = screen.queryByRole("link", { name: "Go to previous page" });
    expect(previousLink).not.toBeInTheDocument();

    expect(screen.getByText("1")).toHaveAttribute("href", mockBuildHref(1));
    expect(screen.getByText("2")).toHaveAttribute("href", mockBuildHref(2));
    expect(screen.getByText("3")).toHaveAttribute("href", mockBuildHref(3));

    const nextLink = screen.getByRole("link", { name: "Go to next page" });
    expect(nextLink).toHaveAttribute("href", mockBuildHref(2));
  });

  it("handles the edge case when on the last page", () => {
    render(<PagiNation {...defaultProps} currentPage={defaultProps.totalPage} />);

    const nextLink = screen.queryByRole("link", { name: "Go to next page" });
    expect(nextLink).not.toBeInTheDocument();

    expect(screen.getByText("98")).toHaveAttribute("href", mockBuildHref(98));
    expect(screen.getByText("99")).toHaveAttribute("href", mockBuildHref(99));
    expect(screen.getByText("100")).toHaveAttribute("href", mockBuildHref(100));

    const previousLink = screen.getByRole("link", { name: "Go to previous page" });
    expect(previousLink).toHaveAttribute("href", mockBuildHref(99));
  });
});
