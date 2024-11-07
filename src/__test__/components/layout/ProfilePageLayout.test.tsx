import { getUser } from "@/actions/user";
import ProfilePageLayout from "@/components/layout/ProfilePageLayout";
import { render, screen } from "@testing-library/react";

const name = "test";
const avatarUrl = "https://avatars.githubusercontent.com/u/145332193?v=4";

jest.mock("@/actions/user", () => ({
  getUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (getUser as jest.Mock).mockResolvedValue({ name, avatarUrl });
});

describe("ProfilePageLayout Component", () => {
  test("renders profile page with name input disabled and title displayed", async () => {
    const ui = await ProfilePageLayout({ title: "マイページ", isEdit: false });
    render(ui);
    const input = screen.getByDisplayValue(name);
    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(screen.getByText(/マイページ/i)).toBeInTheDocument();
  });

  test("renders edit profile page with back button and title displayed", async () => {
    const ui = await ProfilePageLayout({ title: "マイページ編集", isEdit: true });
    render(ui);
    const backButton = screen.getByRole("button", { name: "戻る" });
    expect(backButton.closest("a")).toHaveAttribute("href", "/profile");
    expect(screen.getByText(/マイページ編集/i)).toBeInTheDocument();
  });
});
