import { ZennArticleListSkeleton } from "@/components/layout/skeleton/ZennArticleListSkeleton";
import { render, screen } from "@testing-library/react";

describe("ArticleListSkeleton", () => {
  test("renders the top navigation skeletons", () => {
    render(<ZennArticleListSkeleton />);

    const topSkeletons = screen.getAllByTestId("skeleton-pagination");
    expect(topSkeletons).toHaveLength(6);
  });

  test("renders the list skeletons", () => {
    render(<ZennArticleListSkeleton />);

    const listSkeletons = screen.getAllByTestId("skeleton-list-item");
    expect(listSkeletons).toHaveLength(30);
  });

  test("renders the bottom navigation skeletons", () => {
    render(<ZennArticleListSkeleton />);

    const bottomSkeletons = screen.getAllByTestId("skeleton-pagination-bottom");
    expect(bottomSkeletons).toHaveLength(6);
  });
});
