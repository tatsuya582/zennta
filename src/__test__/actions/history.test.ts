import { addHistory, addStoredItemHistory, getHistory, updateHistory } from "@/actions/history";
import { getSupabaseClientAndUser } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  getSupabaseClientAndUser: jest.fn(),
}));

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

describe("historyActions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({
      supabase: mockSupabase,
      user: { id: userId },
    });
  });

  describe("addHistory", () => {
    it("should add a history article successfully", async () => {
      const mockSupabase = {
        rpc: jest.fn().mockResolvedValue({ data: "mockId", error: null }),
      };
      (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({ supabase: mockSupabase, user: { id: "userId" } });

      await addHistory(storedItem);

      expect(mockSupabase.rpc).toHaveBeenCalledWith("insert_history_with_article", {
        userid: "userId",
        articleurl: storedItem.url,
        articletitle: storedItem.title,
        articlesourcecreatedat: storedItem.created_at,
        tags: storedItem.tags,
      });
    });
  });

  describe("addStoredItemHistory", () => {
    it("should call supabase.rpc with correct parameters", async () => {
      mockSupabase.rpc.mockResolvedValueOnce({ error: null });

      await addStoredItemHistory(storedItem);

      expect(mockSupabase.rpc).toHaveBeenCalledWith("add_or_update_history", {
        user_id: userId,
        article_id: storedItem.id,
      });
    });

    it("should throw an error if supabase.rpc returns an error", async () => {
      const mockSupabase = {
        rpc: jest.fn().mockResolvedValue({ data: null, error: { message: "RPC error" } }),
      };
      (getSupabaseClientAndUser as jest.Mock).mockResolvedValue({ supabase: mockSupabase, user: { id: "userId" } });

      await expect(addStoredItemHistory(storedItem)).rejects.toThrow("RPC error");
    });
  });

  describe("updateHistory", () => {
    let mockEqArticle: jest.Mock;
    let mockEqUser: jest.Mock;
    let mockUpdate: jest.Mock;

    beforeEach(() => {
      mockEqArticle = jest.fn().mockResolvedValue({ error: null });
      mockEqUser = jest.fn(() => ({ eq: mockEqArticle }));
      mockUpdate = jest.fn(() => ({ eq: mockEqUser }));
      mockSupabase.from.mockImplementation(() => ({ update: mockUpdate }));
    });

    it("should update history with correct parameters", async () => {
      await updateHistory(storedItem);

      expect(mockSupabase.from).toHaveBeenCalledWith("histories");
      expect(mockUpdate).toHaveBeenCalledWith({ updatedAt: expect.any(String) });
      expect(mockEqUser).toHaveBeenCalledWith("userId", userId);
      expect(mockEqArticle).toHaveBeenCalledWith("articleId", storedItem.id);
    });

    it("should throw an error if update fails", async () => {
      const mockError = { message: "Update error" };
      mockEqArticle.mockResolvedValueOnce({ error: mockError });

      await expect(updateHistory(storedItem)).rejects.toThrow("Update error");
    });
  });

  describe("getHistory", () => {
    it("should fetch history with correct parameters", async () => {
      const mockData = [
        {
          updatedAt: "2024-01-01T00:00:00.000Z",
          articles: {
            id: "test-article-id",
            title: "test-title",
            url: "test-url",
            tags: ["tag1", "tag2"],
          },
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({ data: mockData }),
            }),
          }),
        }),
      });

      const result = await getHistory();

      expect(mockSupabase.from).toHaveBeenCalledWith("histories");
      expect(mockSupabase.from().select).toHaveBeenCalledWith(`
        updatedAt,
        articles:articleId (id, title, url, tags)
      `);
      expect(result).toEqual(mockData);
    });

    it("should return null if user is not authenticated", async () => {
      (getSupabaseClientAndUser as jest.Mock).mockResolvedValueOnce({ supabase: mockSupabase, user: null });

      const result = await getHistory();

      expect(result).toBeNull();
    });
  });
});
