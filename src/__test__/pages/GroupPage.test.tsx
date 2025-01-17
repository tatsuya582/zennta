import GroupPage, { metadata } from "@/app/group/page";
import { GroupList } from "@/components/layout/main/GroupList";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/layout/main/GroupList", () => ({
  GroupList: jest.fn(() => <div data-testid="GroupList" />),
}));

describe("FavoritePage", () => {
  const mockPage = 1;
  const renderGroupPage = (page = mockPage) => {
    render(
      <GroupPage
        searchParams={{
          page: page.toString(),
        }}
      />
    );
  };
  it("should render the page with correct components and elements", () => {
    renderGroupPage();

    expect(screen.getByTestId("GroupList")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "公開中のお気に入りグループ" })).toBeInTheDocument();
  });

  it("should have correct title in metadata", () => {
    renderGroupPage();
    expect(metadata.title).toBe("お気に入りグループ");
  });

  it("should correctly pass buildHref to GroupList", () => {
    renderGroupPage();

    expect(GroupList).toHaveBeenCalled();

    const passedProps = (GroupList as jest.Mock).mock.calls[0][0];
    expect(passedProps.buildHref(3)).toBe("/group?page=3");
    expect(passedProps.page).toBe(1);
  });
});
