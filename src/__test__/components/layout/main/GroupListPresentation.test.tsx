import { render, screen } from "@testing-library/react";
import { GroupListPresentation } from "@/components/layout/main/GroupListPresentation";

jest.mock("@/components/layout/button/FavoritePageDeleteButton", () => ({
  FavoritePageDeleteButton: jest.fn(() => <div data-testid="favorite-page-delete-button" />),
}));

jest.mock("@/components/layout/main/Article", () => ({
  Article: jest.fn(() => <div data-testid="article" />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

jest.mock("metascraper", () => {
  return jest.fn(() => {
    return async (url: string) => ({
      title: "Mocked Title",
      url,
    });
  });
});

jest.mock("metascraper-title", () => {
  return jest.fn(() => ({}));
});

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
      articles: [
        {
          id: "1",
          title: "test article title1",
          url: "https://test.com",
          tags: [{ name: "tag1" }],
          created_at: "2024-01-01T00:00:00Z",
        },
      ],
    },
    {
      createdAt: "2024-01-01T00:00:00Z",
      id: "2",
      isPublished: true,
      title: "test title2",
      updatedAt: "2024-01-01T00:00:00Z",
      userId: "user-123",
      userName: "test name2",
      articles: [
        {
          id: "1",
          title: "test article title1",
          url: "https://test.com",
          tags: [{ name: "tag1" }],
          created_at: "2024-01-01T00:00:00Z",
        },
      ],
    },
  ];
  const mockPagination = <div data-testid="pagination" />;

  it("renders articles correctly", () => {
    render(<GroupListPresentation groups={mockGroups} />);

    expect(screen.getByText("test title1")).toBeInTheDocument();
    expect(screen.getByText("test title2")).toBeInTheDocument();
    expect(screen.getByText("公開")).toBeInTheDocument();
    expect(screen.getByText("非公開")).toBeInTheDocument();
    expect(screen.getAllByTestId("favorite-page-delete-button")).toHaveLength(2);
    expect(screen.getAllByTestId("article")).toHaveLength(2);
  });

  it("renders articles correctly when other user", () => {
    render(<GroupListPresentation groups={mockGroups} pagination={mockPagination} isOtherUser />);

    expect(screen.getByText("test title1")).toBeInTheDocument();
    expect(screen.getByText("test title2")).toBeInTheDocument();
    expect(screen.getAllByTestId("pagination")).toHaveLength(2);
    expect(screen.getAllByTestId("article")).toHaveLength(2);
  });
});
