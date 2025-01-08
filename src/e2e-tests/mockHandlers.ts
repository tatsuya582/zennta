import { type NextFixture } from "next/experimental/testmode/playwright";

const generateMockQiitaArticles = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `qiita-article-${start + index + 1}`,
    title: `Sample Qiita Article Title ${start + index + 1}`,
    url: `https://example.com/qiita-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

const generateMockZennArticles = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `zenn-article-${start + index + 1}`,
    title: `Sample Zenn Article Title ${start + index + 1}`,
    path: `/zenn-article-${start + index + 1}`,
    published_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

const generateMockSearchQiitaArticles = (page: number, perPage: number, query: string) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `search-qiita-article-${start + index + 1}`,
    title: `Search Qiita Article Title ${query} ${start + index + 1}`,
    url: `https://example.com/search-qiita-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

const generateMockSearchZennArticles = (page: number, perPage: number, query: string) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `zenn-article-${start + index + 1}`,
    title: `Search Zenn Article Title ${query} ${start + index + 1}`,
    path: `/zenn-article-${start + index + 1}`,
    published_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

const generateMockArticles = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `article-${start + index + 1}`,
    column_id: `sample-article-${start + index + 1}`,
    other_column_id: null,
    title: `Sample Article Title ${start + index + 1}`,
    url: `https://example.com/sample-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    is_in_other_table: false,
  }));
};

export const beforeAction = async (next: NextFixture, isSearch = false) => {
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    if (!args[0]?.includes("next.onFetch")) {
      originalConsoleLog(...args);
    }
  };

  next.onFetch(async (request) => {
    const url = new URL(request.url);
    if (url.origin === "https://qiita.com" && url.pathname === "/api/v2/items") {
      const page = url.searchParams.get("page") || "1";
      const perPage = "30";
      const query = url.searchParams.get("query") || "";
      const mockArticles = isSearch
        ? generateMockSearchQiitaArticles(Number(page), Number(perPage), query)
        : generateMockQiitaArticles(Number(page), Number(perPage));
      return new Response(JSON.stringify(mockArticles), {
        headers: {
          "Content-Type": "application/json",
          ...(isSearch && { "Total-Count": "30000" }),
        },
      });
    }

    if (url.origin === "https://zenn.dev" && url.pathname === "/api/articles") {
      const page = url.searchParams.get("page") || "1";
      const perPage = "30";
      const mockArticles = generateMockZennArticles(Number(page), Number(perPage));
      return new Response(JSON.stringify({ articles: mockArticles }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (url.origin === "https://zenn.dev" && url.pathname === "/api/search") {
      const page = url.searchParams.get("page") || "1";
      const perPage = "30";
      const query = url.searchParams.get("q") || "";
      const mockArticles = generateMockSearchZennArticles(Number(page), Number(perPage), query);
      return new Response(JSON.stringify({ articles: mockArticles, next_page: 1 }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (url.origin === "https://nofetch") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method === "DELETE") {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
      });

      return new Response(null, { status: response.status });
    }
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : null,
    });

    if (request.method === "PATCH") {
      return new Response(null, { status: response.status });
    }

    return new Response(await response.text(), {
      status: response.status,
      headers: response.headers,
    });
  });
};

const mockFavoriteArticles = {
  rpc: "fetch_favorites_articles_with_count",
  articles: generateMockArticles(1, 30),
  extraArticle: [
    {
      id: "article-1",
      column_id: "sample-article-1",
      other_column_id: null,
      title: "Sample Article Title 1",
      url: "https://example.com/sample-article-1",
      tags: [{ name: "Tag1" }, { name: "Tag2" }],
      custom_tags: null,
      memo: "test",
      is_in_other_table: true,
    },
  ],
};

const mockReadLaterArticles = {
  rpc: "fetch_read_laters_articles_with_count",
  articles: generateMockArticles(1, 30),
  extraArticle: [
    {
      id: "article-1",
      column_id: "read-laters-article-1",
      other_column_id: null,
      title: "Read Laters Article Title 1",
      url: "https://example.com/read-laters-article-1",
      tags: [{ name: "Tag1" }, { name: "Tag2" }],
      is_in_other_table: true,
    },
  ],
};

export const mockStoredArticles = async (
  next: NextFixture,
  total_count: number,
  tabelName: "readlater" | "favorite",
  isExtra = false
) => {
  next.onFetch(async (request) => {
    const mockArticles = tabelName === "favorite" ? mockFavoriteArticles : mockReadLaterArticles;
    const articles = isExtra ? mockArticles.extraArticle : mockArticles.articles;
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${mockArticles.rpc}`) {
      return new Response(
        JSON.stringify({
          articles: articles,
          total_count: total_count,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  });
};

export const mockSearchQiitaArticles = async (next: NextFixture) => {
  next.onFetch(async (request) => {
    const url = new URL(request.url);
    if (url.origin === "https://qiita.com" && url.pathname === "/api/v2/items") {
      const page = url.searchParams.get("page") || "1";
      const perPage = "30";
      const query = url.searchParams.get("query") || "";
      const mockArticles = generateMockSearchQiitaArticles(Number(page), Number(perPage), query);
      return new Response(JSON.stringify(mockArticles), {
        headers: {
          "Content-Type": "application/json",
          "Total-Count": "150",
        },
      });
    }
  });
};

export const mockSearchZennArticles = async (next: NextFixture) => {
  next.onFetch(async (request) => {
    const url = new URL(request.url);
    if (url.origin === "https://zenn.dev" && url.pathname === "/api/search") {
      const page = url.searchParams.get("page") || "1";
      const perPage = "30";
      const query = url.searchParams.get("q") || "";
      const mockArticles = generateMockSearchZennArticles(Number(page), Number(perPage), query);
      return new Response(JSON.stringify({ articles: mockArticles, next_page: null }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  });
};
