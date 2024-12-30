import { test, expect } from "next/experimental/testmode/playwright";

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

const generateMockReadLaterArticles = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `article-${start + index + 1}`,
    column_id: `read-laters-article-${start + index + 1}`,
    other_column_id: null,
    title: `Read Laters Article Title ${start + index + 1}`,
    url: `https://example.com/read-laters-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    is_in_other_table: false,
  }));
};

const readLaterPage = 1;
const readLaterPerPage = 30;

test.beforeEach(async ({ page, next }) => {
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

    return new Response(await response.text(), {
      status: response.status,
      headers: response.headers,
    });
  });
});

test("should display readlaterpage", async ({ page }) => {
  await page.goto("/readlater");

  await expect(page.locator('h2:has-text("後で読む")')).toBeVisible();
  await expect(page.locator("text=履歴")).toBeVisible();
  const searchForm = await page.getByTestId("search-form");
  await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
  await expect(searchForm.getByRole("button", { name: "delete" })).toBeVisible();
});

test("should display Articles", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_read_laters_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockReadLaterArticles(readLaterPage, readLaterPerPage),
          total_count: 40,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  });

  await page.goto("/readlater");

  const readLaterArticles = await page.getByTestId("read-later-articles");
  await expect(readLaterArticles.getByRole("link", { name: "Read Laters Article Title 1", exact: true })).toBeVisible();
  await expect(readLaterArticles.locator("text=Read Laters Article Title 30")).toBeVisible();
  await expect(readLaterArticles.locator("text=Read Laters Article Title")).toHaveCount(30);
  await expect(readLaterArticles.locator("text=Tag1")).toHaveCount(15);
  await expect(readLaterArticles.locator("text=Tag2")).toHaveCount(15);
  await expect(readLaterArticles.locator("text=読了")).toHaveCount(30);
  await expect(readLaterArticles.locator("text=お気に入り登録")).toHaveCount(30);
});

test("should display pagination", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_read_laters_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockReadLaterArticles(readLaterPage, readLaterPerPage),
          total_count: 3000,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  });

  await page.goto("/readlater");

  const readLaterArticles = await page.getByTestId("read-later-articles");
  const activeButton = readLaterArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(readLaterArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
});

test("should display pagination when less article", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_read_laters_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockReadLaterArticles(readLaterPage, readLaterPerPage),
          total_count: 120,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  });

  await page.goto("/readlater");

  const readLaterArticles = await page.getByTestId("read-later-articles");
  const activeButton = readLaterArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(readLaterArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.locator(".sr-only", { hasText: "More pages" })).not.toBeVisible();
  await expect(readLaterArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
  await expect(readLaterArticles.getByRole("link", { name: "Go to the last page" })).not.toBeVisible();
});

test("Pagination is working correctly", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_read_laters_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockReadLaterArticles(readLaterPage, readLaterPerPage),
          total_count: 3000,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  });
  await page.goto("/readlater");

  const readLaterArticles = await page.getByTestId("read-later-articles");
  const nextPageButton = readLaterArticles.getByRole("link", { name: "2", exact: true });
  nextPageButton.first().click();
  await page.waitForLoadState();

  await expect(nextPageButton).toHaveCount(2);
  await expect(nextPageButton.first()).toHaveAttribute("aria-current", "page");

  const lastPageButton = await readLaterArticles.getByRole("link", { name: "Go to the last page" });
  lastPageButton.first().click();
  await page.waitForLoadState();

  const activeButton = readLaterArticles.getByRole("link", { name: "100", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(readLaterArticles.getByRole("link", { name: "98", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "99", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "Go to previous page" })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "Go to the first page" })).toHaveCount(2);
});

test("Pagination is working correctly when less articles", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_read_laters_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockReadLaterArticles(readLaterPage, readLaterPerPage),
          total_count: 150,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  });
  await page.goto("/readlater");

  const readLaterArticles = await page.getByTestId("read-later-articles");
  const activeButton = readLaterArticles.getByRole("link", { name: "3", exact: true });
  activeButton.first().click();

  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(readLaterArticles.getByRole("link", { name: "1", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "5", exact: true })).toHaveCount(2);
  await expect(readLaterArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
});
