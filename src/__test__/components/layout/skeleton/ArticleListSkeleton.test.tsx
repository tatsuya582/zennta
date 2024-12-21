import { ArticleListSkeleton } from "@/components/layout/skeleton/ArticleListSkeleton";
import { render, screen } from "@testing-library/react";

describe("ArticleListSkeleton", () => {
  test("renders the top navigation skeletons", () => {
    render(<ArticleListSkeleton />);

    const topSkeletons = screen.getAllByTestId("skeleton-pagination");
    expect(topSkeletons).toHaveLength(6);
  });

  test("renders the list skeletons", () => {
    render(<ArticleListSkeleton />);

    const listSkeletons = screen.getAllByTestId("skeleton-list-item");
    expect(listSkeletons).toHaveLength(30);
  });

  test("renders the bottom navigation skeletons", () => {
    render(<ArticleListSkeleton />);

    const bottomSkeletons = screen.getAllByTestId("skeleton-pagination-bottom");
    expect(bottomSkeletons).toHaveLength(6);
  });
});
