import { test, expect } from "next/experimental/testmode/playwright";

const generateMockQiitaArticles = (page: number, perPage: number, query: string) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `qiita-article-${start + index + 1}`,
    title: `Search Qiita Article Title ${query} ${start + index + 1}`,
    url: `https://example.com/qiita-article-${start + index + 1}`,
    tags: index % 2 === 0 ? [{ name: "Tag1" }, { name: "Tag2" }] : null,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

const generateMockZennArticles = (page: number, perPage: number, query: string) => {
  const start = (page - 1) * perPage;
  return Array.from({ length: perPage }, (_, index) => ({
    id: `zenn-article-${start + index + 1}`,
    title: `Search Zenn Article Title ${query} ${start + index + 1}`,
    path: `/zenn-article-${start + index + 1}`,
    published_at: new Date(Date.now() - index * 86400000).toISOString(),
  }));
};

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
      const query = url.searchParams.get("query") || "";
      const mockArticles = generateMockQiitaArticles(Number(page), Number(perPage), query);
      return new Response(JSON.stringify(mockArticles), {
        headers: {
          "Content-Type": "application/json",
          "Total-Count": "30000",
        },
      });
    }
    if (url.origin === "https://zenn.dev" && url.pathname === "/api/search") {
      const page = url.searchParams.get("page") || "1";
      const perPage = "30";
      const query = url.searchParams.get("q") || "";
      const mockArticles = generateMockZennArticles(Number(page), Number(perPage), query);
      return new Response(JSON.stringify({ articles: mockArticles, next_page: 1 }), {
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

test("should display searchpage", async ({ page }) => {
  await page.goto("/search");
  await expect(page.locator("text=Zennta")).toBeVisible();
  await expect(page.locator("nav a")).toHaveCount(5);
  await expect(page.locator("text=履歴")).toBeVisible();
  await expect(page.locator('h2:has-text("検索")')).toBeVisible();
  const searchForm = await page.getByTestId("search-form");
  await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
  await expect(searchForm.getByRole("button", { name: "delete" })).toBeVisible();
  await expect(page.locator("text=なにか入力してください")).toBeVisible();
});

test("Display the search page when you actually search", async ({ page }) => {
  await page.goto("/search");

  const searchForm = await page.getByTestId("search-form");
  await searchForm.getByPlaceholder("検索ワードを入力").fill("Next.js");
  await searchForm.getByRole("button", { name: "delete" }).click();
  await page.waitForLoadState();
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible();

  const searchInput = await page.locator('input[name="name"]');
  await expect(searchInput).toHaveValue("Next.js", { timeout: 50000 });
  expect(page.url()).toBe("http://localhost:3000/search?query=Next.js");

  await expect(page.locator("text=Qiita一覧")).toBeVisible();
  await expect(page.locator("text=Zenn一覧")).toBeVisible();
});
