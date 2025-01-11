import { addFavoriteGroup, getCreateGroupArticles } from "@/actions/group";
import { getSupabaseClientAndUser } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  getSupabaseClientAndUser: jest.fn(),
}));

const mockSupabase = {
  from: jest.fn(),
  rpc: jest.fn(),
};
const userId = "mockUserId";
const groupId = "mockGroupId";
const title = "mockTitle";
const mockArticles = [
  {
    favoriteId: "1",
    title: "Example Article",
  },
  {
    favoriteId: "2",
    title: "Example Article",
  },
];

describe("groupActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({
      supabase: mockSupabase,
      user: { id: userId },
    });
  });

  it("should add a favorite group successfully", async () => {
    mockSupabase.from.mockImplementation(() => ({
      insert: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ data: [{ id: groupId }], error: null }),
      })),
    }));

    const result = await addFavoriteGroup(mockArticles, title);
    expect(mockSupabase.from).toHaveBeenCalledWith("favoriteGroups");
    expect(result).toBe(groupId);
  });

  it("should get create group articles", async () => {
    mockSupabase.rpc.mockResolvedValue({ data: { articles: [], total_count: 0 } });
    const page = 1;
    const query = "test";

    const result = await getCreateGroupArticles(page, query);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("fetch_create_group__articles", {
      user_id: userId,
      page,
      query,
    });
    expect(result).toEqual({ articles: [], totalPage: 1 });
  });
});
