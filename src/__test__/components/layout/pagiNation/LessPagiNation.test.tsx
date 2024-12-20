import { render, screen } from '@testing-library/react';
import { type PagiNationProps } from '@/types/types';
import { LessPagiNation } from '@/components/layout/pagiNation/LessPagiNation';

describe('LessPagiNation Component', () => {
  const mockBuildHref = (page: number) => `/page/${page}`;

  const defaultProps: PagiNationProps = {
    currentPage: 2,
    totalPage: 5,
    buildHref: mockBuildHref,
  };

  it('renders the correct number of page links', () => {
    render(<LessPagiNation {...defaultProps} />);

    const pageLinks = screen.getAllByRole('link');
    expect(pageLinks).toHaveLength(defaultProps.totalPage);
  });

  it('displays the correct href for each page link', () => {
    render(<LessPagiNation {...defaultProps} />);

    Array.from({ length: defaultProps.totalPage }, (_, index) => {
      const pageNumber = index + 1;
      const link = screen.getByText(pageNumber.toString());
      expect(link).toHaveAttribute('href', mockBuildHref(pageNumber));
    });
  });

  it('highlights the current page link', () => {
    render(<LessPagiNation {...defaultProps} />);
  
    const currentPageLink = screen.getByText(defaultProps.currentPage.toString());
    expect(currentPageLink).toHaveAttribute('aria-current', 'page'); // activeは aria-current="page"
  });

  it('does not highlight non-current page links', () => {
    render(<LessPagiNation {...defaultProps} />);

    Array.from({ length: defaultProps.totalPage }, (_, index) => index + 1).forEach((pageNumber) => {
      if (pageNumber !== defaultProps.currentPage) {
        const link = screen.getByText(pageNumber.toString());
        expect(link).not.toHaveAttribute('aria-current', 'page');
      }
    });
  });

  it('handles edge case with only one page', () => {
    render(<LessPagiNation currentPage={1} totalPage={1} buildHref={mockBuildHref} />);

    const pageLinks = screen.getAllByRole('link');
    expect(pageLinks).toHaveLength(1);
    expect(pageLinks[0]).toHaveTextContent('1');
    expect(pageLinks[0]).toHaveAttribute('href', mockBuildHref(1));
  });
});
