import { type Page, type NextFixture } from "next/experimental/testmode/playwright";

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

const generateMockFavoriteArticles = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `article-${start + index + 1}`,
    column_id: `favorites-article-${start + index + 1}`,
    other_column_id: null,
    title: `Favorite Article Title ${start + index + 1}`,
    url: `https://example.com/favorites-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    is_in_other_table: false,
  }));
};

const favoritePage = 1;
const favoritePerPage = 30;

export const beforeAction = async (next: NextFixture) => {
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
      const mockArticles = generateMockQiitaArticles(Number(page), Number(perPage));
      return new Response(JSON.stringify(mockArticles), {
        headers: {
          "Content-Type": "application/json",
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

export const mockFavoriteArticles = async (next: NextFixture, total_count: number, hasMemo = false) => {
  next.onFetch(async (request) => {
    const articles = hasMemo
      ? [
          {
            id: "article-1",
            column_id: "favorites-article-1",
            other_column_id: null,
            title: "Read Laters Article Title 1",
            url: "https://example.com/read-laters-article-1",
            tags: [{ name: "Tag1" }, { name: "Tag2" }],
            custom_tags: null,
            memo: "test",
            is_in_other_table: true,
          },
        ]
      : generateMockFavoriteArticles(favoritePage, favoritePerPage);
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
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
