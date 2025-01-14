import {
  addFavoriteGroup,
  getCreateGroupArticles,
  getFavoriteGroup,
  getFavoriteGroupByUser,
  getFavoriteGroupTitle,
} from "@/actions/group";
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
// const data: {
//   createdAt: string;
//   id: string;
//   isPublished: boolean;
//   title: string;
//   updatedAt: string;
//   userId: string;
//   userName: string;
// }[] | null
// const mockGroup = [{
//   createdAt: string;
//   id: string;
//   isPublished: boolean;
//   title: string;
//   updatedAt: string;
//   userId: string;
//   userName: string;
// }]

describe("groupActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({
      supabase: mockSupabase,
      user: { id: userId },
    });
  });

  it("should add a favorite group successfully", async () => {
    mockSupabase.rpc.mockResolvedValue({ data: groupId });

    const result = await addFavoriteGroup(mockArticles, title);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("add_favorite_group", {
      user_id: userId,
      group_title: title,
      articles: mockArticles,
    });

    expect(result).toBe(groupId);
  });

  it("should get create group articles", async () => {
    mockSupabase.rpc.mockResolvedValue({ data: { articles: [], total_count: 0 } });
    const page = 1;
    const query = "test";

    const result = await getCreateGroupArticles(page, query);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("fetch_create_group_articles", {
      user_id: userId,
      page,
      query,
    });
    expect(result).toEqual({ articles: [], totalPage: 1 });
  });

  it("should fetch the title of a favorite group", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: { title } }),
        })),
      })),
    }));

    const result = await getFavoriteGroupTitle(groupId);
    expect(mockSupabase.from).toHaveBeenCalledWith("favoriteGroups");
    expect(result).toBe(title);
  });

  it("should fetch articles by favorite group ID", async () => {
    mockSupabase.rpc.mockResolvedValue({ data: mockArticles });

    const result = await getFavoriteGroup(groupId);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("fetch_articles_by_favorite_group", {
      group_id: groupId,
    });
    expect(result).toEqual(mockArticles);
  });

  it("should fetch articles by user ID", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: mockArticles }),
      })),
    }));

    const result = await getFavoriteGroupByUser();
    expect(mockSupabase.from).toHaveBeenCalledWith("favoriteGroups");
    expect(result).toBe(mockArticles);
  });
});
