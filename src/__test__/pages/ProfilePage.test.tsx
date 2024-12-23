import { render, screen } from "@testing-library/react";
import ProfilePage, { metadata } from "@/app/profile/page";
import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";

jest.mock("@/actions/user", () => ({
  getUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/components/layout/form/UserForm/UserForm", () => ({
  UserForm: jest.fn(({ name }) => <div data-testid="user-form">{`name=${name}`}</div>),
}));

jest.mock("@/components/layout/skeleton/ProfilePageSkeleton", () => ({
  ProfilePageSkeleton: jest.fn(() => <div data-testid="profile-page-skeleton" />),
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render metadata title correctly", () => {
    expect(metadata.title).toBe("マイページ");
  });

  it("should redirect to /login if user is not found", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);
    await ProfilePage();
    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("should render the page correctly if user is found", async () => {
    const mockUser = {
      name: "Test User",
      avatarUrl: "/test-avatar.jpg",
    };
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    render(await ProfilePage());

    expect(screen.getByRole("heading", { level: 2, name: "マイページ" })).toBeInTheDocument();
    expect(screen.getByAltText("user image").getAttribute("src")).toContain("test-avatar.jpg");
    expect(screen.getByTestId("user-form")).toHaveTextContent("name=Test User");
  });

  it("should render the default avatar image if avatarUrl is null", async () => {
    const mockUser = {
      name: "Test User",
      avatarUrl: null,
    };
    (getUser as jest.Mock).mockResolvedValue(mockUser);

    render(await ProfilePage());

    expect(screen.getByAltText("user image").getAttribute("src")).toContain("no_image.jpg");
  });
});
