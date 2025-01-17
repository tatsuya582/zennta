import { type NextFixture } from "next/experimental/testmode/playwright";

const generateMockArticles = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `article-${start + index + 1}`,
    favoriteId: `article-${start + index + 1}`,
    column_id: `sample-article-${start + index + 1}`,
    other_column_id: null,
    title: `Sample Article Title ${start + index + 1}`,
    url: `https://example.com/sample-article-${start + index + 1}`,
    path: `/sample-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    is_in_other_table: false,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    published_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

const generateMockGroups = (page = 1, perPage = 10) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `group-${start + index + 1}`,
    title: `Sample Group Title ${start + index + 1}`,
    userId: `user-${start + index + 1}`,
    articles: generateMockArticles(1, 3),
    userName: "匿名",
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - index * 86400000).toISOString(),
    isPublished: true,
  }));
};

const mockExtraArticles = [
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
];

const getQiitaResponse = async (url: URL, options: { totalCount?: string } = {}) => {
  const page = url.searchParams.get("page") || "1";
  const { totalCount = "30000" } = options;
  return new Response(JSON.stringify(generateMockArticles(Number(page), 30)), {
    headers: {
      "Content-Type": "application/json",
      "Total-Count": totalCount,
    },
  });
};

const getZennResponse = async (url: URL, options: { nextPage?: string | null } = {}) => {
  const page = url.searchParams.get("page") || "1";
  const { nextPage = "1" } = options;
  return new Response(JSON.stringify({ articles: generateMockArticles(Number(page), 30), next_page: nextPage }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const mockGroups = async (next: NextFixture, total_count: number, page = 1) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorite_groups_and_articles`) {
      return new Response(JSON.stringify(generateMockGroups(page)), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (
      request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/favoriteGroups?select=count&isPublished=eq.true`
    ) {
      return new Response(JSON.stringify([{ count: total_count }]), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  });
};

export const mockStoredArticles = async (
  next: NextFixture,
  total_count: number,
  tabelName: "readlater" | "favorite" | "group",
  isExtra = false
) => {
  next.onFetch(async (request) => {
    const rpc =
      tabelName === "favorite"
        ? "fetch_favorites_articles_with_count"
        : tabelName === "readlater"
          ? "fetch_read_laters_articles_with_count"
          : "fetch_create_group_articles";
    const articles = isExtra ? mockExtraArticles : generateMockArticles(1, 30);
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${rpc}`) {
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
      return getQiitaResponse(url, { totalCount: "150" });
    }
  });
};

export const mockSearchZennArticles = async (next: NextFixture) => {
  next.onFetch(async (request) => {
    const url = new URL(request.url);
    if (url.origin === "https://zenn.dev" && url.pathname === "/api/search") {
      return getZennResponse(url, { nextPage: null });
    }
  });
};

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
      return getQiitaResponse(url);
    }

    if (url.origin === "https://zenn.dev" && (url.pathname === "/api/articles" || url.pathname === "/api/search")) {
      return getZennResponse(url);
    }

    if (url.origin === "https://nofetch") {
      return new Response("Not Found", { status: 404 });
    }

    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : null,
    });

    if (request.method === "PATCH" || request.method === "DELETE") {
      return new Response(null, { status: response.status });
    }

    return new Response(await response.text(), {
      status: response.status,
      headers: response.headers,
    });
  });
};
