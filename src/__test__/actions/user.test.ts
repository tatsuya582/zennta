import { getUser, updateUser } from "@/actions/user";
import { getSupabaseClientAndUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

jest.mock("@/lib/supabase/server");
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  cache: jest.fn((fn) => fn),
}));

describe("User Actions", () => {
  const mockSupabase = {
    from: jest.fn(),
  };
  const mockUser = { id: "test-user-id" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({
      supabase: mockSupabase,
      user: mockUser,
    });
  });

  describe("getUser", () => {
    it("should return user data when user is logged in", async () => {
      const mockData = { name: "Test User", avatarUrl: "test-avatar-url" };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      const result = await getUser();

      expect(getSupabaseClientAndUser).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith("users");
      expect(result).toEqual(mockData);
    });

    it("should log an error if fetching user fails", async () => {
      const mockError = { message: "Fetch error" };
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      console.error = jest.fn(); // Mock console.error
      const result = await getUser();

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith("Error fetching user:", mockError);
    });

    it("should return undefined if no user is logged in", async () => {
      (getSupabaseClientAndUser as jest.Mock).mockResolvedValueOnce({ supabase: mockSupabase, user: null });

      const result = await getUser();

      expect(result).toBeUndefined();
    });
  });

  describe("updateUser", () => {
    it("should update user name and redirect to /profile", async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      });

      await updateUser("Updated Name");

      expect(mockSupabase.from).toHaveBeenCalledWith("users");
      expect(mockSupabase.from().update).toHaveBeenCalledWith({ name: "Updated Name" });
      expect(mockSupabase.from().update().eq).toHaveBeenCalledWith("id", mockUser.id);
      expect(redirect).toHaveBeenCalledWith("/profile");
    });

    it("should redirect to /login if user is not logged in", async () => {
      (getSupabaseClientAndUser as jest.Mock).mockResolvedValueOnce({ supabase: mockSupabase, user: null });

      await updateUser("Updated Name");

      expect(redirect).toHaveBeenCalledWith("/login");
    });

    it("should throw an error if update fails", async () => {
      const mockError = { message: "Update error" };
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: mockError }),
        }),
      });

      await expect(updateUser("Updated Name")).rejects.toThrow(
        "ユーザー情報の更新中にエラーが発生しました: Update error"
      );
    });
  });
});
