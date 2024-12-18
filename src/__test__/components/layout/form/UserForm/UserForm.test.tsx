import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { useUserForm } from "@/components/layout/form/UserForm/useUserForm";
import UserForm from "@/components/layout/form/UserForm/UserForm";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

jest.mock("@/components/layout/form/UserForm/useUserForm", () => ({
  useUserForm: jest.fn(),
}));

jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormField: ({ children }: { children: React.ReactNode }) => (
    <div>
      <label htmlFor="mock-textarea">Label</label>
      <textarea id="mock-textarea" />
      {children}
    </div>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  FormMessage: () => <div />,
}));

jest.mock("@/components/layout/form/UserForm/useUserForm");

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "名前は2文字以上にしてください",
    })
    .max(50, {
      message: "名前は50文字以下にしてください",
    }),
});

describe("UserForm Component", () => {
  const mockOnSubmit = jest.fn();
  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      control: {},
      handleSubmit: jest.fn((fn) => fn),
      watch: jest.fn(),
      reset: jest.fn(),
    });

    (useUserForm as jest.Mock).mockReturnValue({
      form: useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          value: "",
        },
      }),
      onSubmit: mockOnSubmit,
      isLoading: false,
    });
  });

  it("displays the name in the initial state", () => {
    const mockUseUserForm = jest.fn().mockReturnValue({
      form: { handleSubmit: jest.fn(), control: {} },
      onSubmit: jest.fn(),
      isLoading: false,
    });
    (useUserForm as jest.Mock).mockImplementation(mockUseUserForm);

    render(<UserForm name="Test Name" />);
    expect(screen.getByDisplayValue("Test Name")).toBeInTheDocument();
  });

  it("opens the dialog when the edit button is clicked", () => {
    const mockUseUserForm = jest.fn().mockReturnValue({
      form: { handleSubmit: jest.fn(), control: {} },
      onSubmit: jest.fn(),
      isLoading: false,
    });
    (useUserForm as jest.Mock).mockImplementation(mockUseUserForm);

    render(<UserForm name="Test Name" />);

    const editButton = screen.getByRole("button", { name: "編集" });
    fireEvent.click(editButton);

    expect(screen.getByText("名前を変更しますか？")).toBeInTheDocument();
    expect(screen.getByText("2文字以上50文字以内で入力してください。")).toBeInTheDocument();
  });

  it("calls onSubmit when the form is submitted", async () => {
    render(<UserForm name="Test Name" />);

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    const dialog = screen.getByRole("dialog");
    const submitButton = within(dialog).getByText("編集");

    const form = submitButton.closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
