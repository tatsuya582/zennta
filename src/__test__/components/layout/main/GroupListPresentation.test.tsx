import { render, screen } from "@testing-library/react";
import { GroupListPresentation } from "@/components/layout/main/GroupListPresentation";

jest.mock("@/components/layout/button/FavoritePageDeleteButton", () => ({
  FavoritePageDeleteButton: jest.fn(() => <div data-testid="favorite-page-delete-button" />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

describe("GroupListPresentation", () => {
  const mockGroups = [
    {
      createdAt: "2024-01-01T00:00:00Z",
      id: "1",
      isPublished: false,
      title: "test title1",
      updatedAt: "2024-01-01T00:00:00Z",
      userId: "user-123",
      userName: "test name1",
    },
    {
      createdAt: "2024-01-01T00:00:00Z",
      id: "2",
      isPublished: false,
      title: "test title2",
      updatedAt: "2024-01-01T00:00:00Z",
      userId: "user-123",
      userName: "test name2",
    },
  ];

  it("renders articles correctly", () => {
    render(<GroupListPresentation groups={mockGroups} />);

    expect(screen.getByText("お気に入りグループ")).toBeInTheDocument();
    expect(screen.getByText("test title1")).toBeInTheDocument();
    expect(screen.getByText("test title2")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "編集" })).toHaveLength(2);
    expect(screen.getAllByTestId("favorite-page-delete-button")).toHaveLength(2);
  });
});
