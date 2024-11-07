import { getUser } from "@/actions/user";
import UserForm from "@/components/layout/form/UserForm/UserForm";
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

describe("UserForm Component", () => {
  describe("edit is false", () => {
    test("should display the input with the correct value and be disabled", () => {
      render(<UserForm name={name} edit={false} />);
      const input = screen.getByDisplayValue(name);
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
    });

    test("should display the '名前' label", () => {
      render(<UserForm name={name} edit={false} />);
      expect(screen.getByLabelText("名前")).toBeInTheDocument();
    });

    test("should display the '編集' button", () => {
      render(<UserForm name={name} edit={false} />);
      expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
    });

    test("should have the correct link for the '編集' button", () => {
      render(<UserForm name={name} edit={false} />);
      const editButton = screen.getByRole("button", { name: "編集" });
      expect(editButton.closest("a")).toHaveAttribute("href", "/profile/edit");
    });
  });
  describe("edit is true", () => {
    test("should display the input with the correct value and be enabled", () => {
      render(<UserForm name={name} edit={true} />);
      const input = screen.getByDisplayValue(name);
      expect(input).toBeInTheDocument();
      expect(input).not.toBeDisabled();
    });

    test("should have the correct link for the '戻る' button", () => {
      render(<UserForm name={name} edit={true} />);
      const backButton = screen.getByRole("button", { name: "戻る" });
      expect(backButton.closest("a")).toHaveAttribute("href", "/profile");
    });

    test("should display the '編集' button as submit", () => {
      render(<UserForm name={name} edit={true} />);
      const editButton = screen.getByRole("button", { name: "編集" });
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveAttribute("type", "submit");
    });

    test("should display the correct placeholder in the input", () => {
      render(<UserForm name={name} edit={true} />);
      const input = screen.getByPlaceholderText("名前");
      expect(input).toBeInTheDocument();
    });

    test("should display the validation message for name", () => {
      render(<UserForm name={name} edit={true} />);
      expect(screen.getByText("名前は2文字以上、50文字以下にしてください")).toBeInTheDocument();
    });
  });
});
