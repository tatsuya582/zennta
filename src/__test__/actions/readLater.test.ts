import {
  addreadLater,
  addStoredreadLater,
  deleteReadLater,
  getReadLater,
  getReadLaterArticles,
  getReadLaterHistory,
} from "@/actions/readLater";
import { getSupabaseClientAndUser } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  getSupabaseClientAndUser: jest.fn(),
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
  return jest.fn(() => ({
    // 必要ならモックの振る舞いを定義
  }));
});

const mockSupabase = {
  from: jest.fn(),
  rpc: jest.fn(),
};
const userId = "mockUserId";

const storedItem = {
  id: "0001",
  url: "https://example.com",
  title: "Example Article",
  created_at: "2024-01-01",
  tags: [{ name: "tag1" }, { name: "tag2" }],
};

const fetchedItems = [
  {
    id: "1",
    url: "https://example.com/1",
    title: "Example Article",
    created_at: "2024-01-01",
    tags: [{ name: "tag1" }, { name: "tag2" }],
  },
  {
    id: "2",
    url: "https://example.com/2",
    title: "Example Article",
    created_at: "2024-01-01",
    tags: [{ name: "tag1" }, { name: "tag2" }],
  },
];

describe("readLaterActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({
      supabase: mockSupabase,
      user: { id: userId },
    });
  });

  it("should add a read later article successfully", async () => {
    const mockSupabase = {
      rpc: jest.fn().mockResolvedValue({ data: "mockId", error: null }),
    };
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({ supabase: mockSupabase, user: { id: "userId" } });

    const result = await addreadLater(storedItem);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("insert_read_later_with_article", {
      userid: "userId",
      articleurl: storedItem.url,
      articletitle: storedItem.title,
      articlesourcecreatedat: storedItem.created_at,
      tags: storedItem.tags,
    });
    expect(result).toBe("mockId");
  });

  it("should throw an error if RPC call fails", async () => {
    const mockSupabase = {
      rpc: jest.fn().mockResolvedValue({ data: null, error: { message: "RPC error" } }),
    };
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({ supabase: mockSupabase, user: { id: "userId" } });

    await expect(addreadLater(storedItem)).rejects.toThrow("RPC error");
  });

  it("should return undefined if no user is authenticated", async () => {
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({ supabase: {}, user: null });

    const result = await addreadLater(storedItem);
    expect(result).toBeUndefined();
  });

  it("should add a stored read later successfully", async () => {
    mockSupabase.from.mockImplementation(() => ({
      insert: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ data: [{ id: "mockId" }], error: null }),
      })),
    }));

    const result = await addStoredreadLater(storedItem);

    expect(mockSupabase.from).toHaveBeenCalledWith("readLaters");
    expect(result).toBe("mockId");
  });

  it("should get read later articles", async () => {
    mockSupabase.rpc.mockResolvedValue({ data: { articles: [], total_count: 0 } });
    const page = 1;
    const query = "test";

    const result = await getReadLaterArticles(page, query);

    expect(mockSupabase.rpc).toHaveBeenCalledWith("fetch_read_laters_articles_with_count", {
      user_id: userId,
      page,
      query,
    });
    expect(result).toEqual({ articles: [], totalPage: 1 });
  });

  it("should get read laters as a map", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            lte: jest.fn(() => ({
              not: jest.fn().mockResolvedValue({
                data: [
                  { id: "1", articles: { url: "https://example.com/1" } },
                  { id: "2", articles: { url: "https://example.com/2" } },
                ],
              }),
            })),
          })),
        })),
      })),
    }));

    const result = await getReadLater(fetchedItems);

    expect(mockSupabase.from).toHaveBeenCalledWith("readLaters");
    expect(result).toEqual(
      new Map([
        ["https://example.com/1", "1"],
        ["https://example.com/2", "2"],
      ])
    );
  });

  it("should get read later history", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          not: jest.fn().mockResolvedValue({
            data: [
              { id: "1", articles: { url: "https://example.com/history1" } },
              { id: "2", articles: { url: "https://example.com/history2" } },
            ],
          }),
        })),
      })),
    }));

    const result = await getReadLaterHistory();

    expect(mockSupabase.from).toHaveBeenCalledWith("readLaters");
    expect(result).toEqual(
      new Map([
        ["https://example.com/history1", "1"],
        ["https://example.com/history2", "2"],
      ])
    );
  });

  it("should delete a read later successfully", async () => {
    const deleteMock = jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ error: null }),
    }));

    mockSupabase.from.mockImplementation(() => ({
      delete: deleteMock,
    }));

    const articleId = "mockArticleId";
    await deleteReadLater(articleId);

    expect(mockSupabase.from).toHaveBeenCalledWith("readLaters");
    expect(mockSupabase.from().delete).toHaveBeenCalled();
  });
});
