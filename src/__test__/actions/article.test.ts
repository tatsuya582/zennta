import { getArticles, searchArticles} from "@/actions/article";

describe("Article fetchers", () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetchQiitaArticles fetches and processes data correctly", async () => {
    const mockResponse = [
      {
        id: "123",
        title: "Test Article",
        url: "https://qiita.com/test/article",
        tags: [{ name: "JavaScript" }],
        created_at: "2024-12-01T12:00:00Z",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getArticles("1", "Qiita");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://qiita.com/api/v2/items?page=1&per_page=30",
      expect.objectContaining({
        method: "GET",
      })
    );
    expect(result).toEqual({
      articles: [
        {
          id: "123",
          title: "Test Article",
          url: "https://qiita.com/test/article",
          tags: [{ name: "JavaScript" }],
          created_at: "2024-12-01T12:00:00Z",
        },
      ],
      totalPage: 100,
    });
  });

  test("fetchQiitaArticles handles API errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await getArticles("1", "Qiita");
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("fetchZennArticles fetches and processes data correctly", async () => {
    const mockResponse = {
      articles: [
        {
          id: "456",
          title: "Zenn Test Article",
          path: "/test/article",
          published_at: "2024-12-02T12:00:00Z",
        },
      ],
      next_page: 2,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await getArticles("1", "Zenn");
    expect(global.fetch).toHaveBeenCalledWith("https://zenn.dev/api/articles?page=1&order=latest");
    expect(result).toEqual({
      articles: [
        {
          id: "456",
          title: "Zenn Test Article",
          url: "https://zenn.dev/test/article",
          tags: null,
          created_at: "2024-12-02T12:00:00Z",
        },
      ],
      next_page: 2,
    });
  });

  test("fetchZennArticles handles API errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await getArticles("1", "Zenn");
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("searchQiitaArticles fetches and processes data correctly", async () => {
    const mockResponse = [
      {
        id: "123",
        title: "Test Article",
        url: "https://qiita.com/test/article",
        tags: [{ name: "JavaScript" }],
        created_at: "2024-12-01T12:00:00Z",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      headers: {
        get: () => "90", // Mocking `Total-Count` header
      },
    });

    const result = await searchArticles("1", "test", "Qiita");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://qiita.com/api/v2/items?page=1&per_page=30&query=test",
      expect.objectContaining({
        method: "GET",
      })
    );
    expect(result).toEqual({
      articles: [
        {
          id: "123",
          title: "Test Article",
          url: "https://qiita.com/test/article",
          tags: [{ name: "JavaScript" }],
          created_at: "2024-12-01T12:00:00Z",
        },
      ],
      totalPage: 3,
    });
  });


  test("searchQiitaArticles handles API errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await searchArticles("1", "test", "Qiita");
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("searchZennArticles fetches and processes data correctly", async () => {
    const mockResponse = {
      articles: [
        {
          id: "456",
          title: "Zenn Test Article",
          path: "/test/article",
          published_at: "2024-12-02T12:00:00Z",
        },
      ],
      next_page: 2,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await searchArticles("1", "test", "Zenn");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://zenn.dev/api/search?q=test&order=latest&source=articles&page=1"
    );
    expect(result).toEqual({
      articles: [
        {
          id: "456",
          title: "Zenn Test Article",
          url: "https://zenn.dev/test/article",
          tags: null,
          created_at: "2024-12-02T12:00:00Z",
        },
      ],
      next_page: 2,
    });
  });

  test("searchZennArticles handles API errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await searchArticles("1", "test", "Zenn");
    expect(global.fetch).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});