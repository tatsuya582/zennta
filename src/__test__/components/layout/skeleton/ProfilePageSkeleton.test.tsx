import { ProfilePageSkeleton } from "@/components/layout/skeleton/ProfilePageSkeleton";
import { render, screen } from "@testing-library/react";

describe("ProfilePageSkeleton", () => {
  test("renders the page title", () => {
    render(<ProfilePageSkeleton />);
    const title = screen.getByText("マイページ");
    expect(title).toBeInTheDocument();
  });

  test("renders the profile image skeleton", () => {
    render(<ProfilePageSkeleton />);
    const profileImageSkeleton = screen.getByTestId("skeleton-image");
    expect(profileImageSkeleton).toBeInTheDocument();
  });

  test("renders the details skeleton", () => {
    render(<ProfilePageSkeleton />);
    const detailsSkeleton = screen.getByTestId("skeleton-button");
    expect(detailsSkeleton).toBeInTheDocument();
  });
});
