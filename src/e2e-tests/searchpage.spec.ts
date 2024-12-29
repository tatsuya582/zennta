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

// test("should display searchpage", async ({ page }) => {
//   await page.goto("/search");
//   await expect(page.locator("text=Zennta")).toBeVisible();
//   await expect(page.locator("nav a")).toHaveCount(5);
//   await expect(page.locator("text=履歴")).toBeVisible();
//   await expect(page.locator('h2:has-text("検索")')).toBeVisible();
//   const searchForm = await page.getByTestId("search-form");
//   await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
//   await expect(searchForm.getByRole("button", { name: "delete" })).toBeVisible();
//   await expect(page.locator("text=なにか入力してください")).toBeVisible();
// });

// test("Display the search page when you actually search", async ({ page }) => {
//   await page.goto("/search");

//   const searchForm = await page.getByTestId("search-form");
//   await searchForm.getByPlaceholder("検索ワードを入力").fill("Next.js");
//   await searchForm.getByRole("button", { name: "delete" }).click();
//   await page.waitForLoadState();
//   await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible();

//   const searchInput = await page.locator('input[name="name"]');
//   await expect(searchInput).toHaveValue("Next.js", { timeout: 50000 });
//   expect(page.url()).toBe("http://localhost:3000/search?query=Next.js");

//   await expect(page.locator("text=Qiita一覧")).toBeVisible();
//   await expect(page.locator("text=Zenn一覧")).toBeVisible();
// });

// test("should display Qiita Articles", async ({ page }) => {
//   await page.goto("/search?query=Next.js");

//   await page.waitForLoadState();
//   await expect(page.locator("text=Qiita一覧")).toBeVisible();
//   const qiitaArticles = await page.getByTestId("qiita-articles");
//   await expect(
//     qiitaArticles.getByRole("link", { name: "Search Qiita Article Title Next.js 1", exact: true })
//   ).toBeVisible();
//   await expect(qiitaArticles.locator("text=Search Qiita Article Title Next.js 30")).toBeVisible();
//   await expect(qiitaArticles.locator("text=Search Qiita Article Title Next.js")).toHaveCount(30);
//   await expect(qiitaArticles.locator("text=Tag1")).toHaveCount(15);
//   await expect(qiitaArticles.locator("text=Tag2")).toHaveCount(15);
//   await expect(qiitaArticles.locator("text=後で読む")).toHaveCount(30);
//   await expect(qiitaArticles.locator("text=お気に入り登録")).toHaveCount(30);
// });

test("should display pagination of Qiita Articles", async ({ page }) => {
  await page.goto("/search?query=Next.js");
  const qiitaArticles = await page.getByTestId("qiita-articles");

  const activeButton = qiitaArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(qiitaArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
});

// test("should display Zenn Articles", async ({ page }) => {
//   await page.goto("/search?query=Next.js");
//   const zennArticles = await page.getByTestId("zenn-articles");
//   await expect(
//     zennArticles.getByRole("link", { name: "Search Zenn Article Title Next.js 1", exact: true })
//   ).toBeVisible();
//   await expect(zennArticles.locator("text=Search Zenn Article Title Next.js 30")).toBeVisible();
//   await expect(zennArticles.locator("text=Search Zenn Article Title Next.js")).toHaveCount(30);
//   await expect(zennArticles.locator("text=後で読む")).toHaveCount(30);
//   await expect(zennArticles.locator("text=お気に入り登録")).toHaveCount(30);
// });

// test("should display pagination of Zenn Articles", async ({ page }) => {
//   await page.goto("/search?query=Next.js");
//   const zennArticles = await page.getByTestId("zenn-articles");

//   const activeButton = zennArticles.getByRole("link", { name: "1", exact: true });
//   await expect(activeButton).toHaveCount(2);
//   await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

//   await expect(zennArticles.getByRole("link", { name: "2", exact: true })).not.toBeVisible();
//   await expect(zennArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
// });

test("Qiita article pagination is working correctly", async ({ page }) => {
  await page.goto("/search?query=Next.js");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const nextPageButton = await qiitaArticles.getByRole("link", { name: "2", exact: true });
  nextPageButton.first().click();
  await page.waitForLoadState();
  await expect(qiitaArticles.locator("text=Search Qiita Article Title Next.js 31")).toBeVisible();
  const activeButton = qiitaArticles.getByRole("link", { name: "2", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");
});

test("The last page of the Qiita article is page 100", async ({ page }) => {
  await page.goto("/search?query=Next.js");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const zennArticles = await page.getByTestId("zenn-articles");
  const lastPageButton = await qiitaArticles.getByRole("link", { name: "Go to the last page" });
  lastPageButton.first().click();
  await page.waitForLoadState();
  await expect(qiitaArticles.locator("text=Search Qiita Article Title Next.js 3000")).toBeVisible();
  await expect(zennArticles.locator("text=Search Zenn Article Title Next.js 30")).toBeVisible();
  const activeButton = qiitaArticles.getByRole("link", { name: "100", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(qiitaArticles.getByRole("link", { name: "98", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "99", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to previous page" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to the first page" })).toHaveCount(2);
});

test("Testing pagination when there are few Qiita articles", async ({ page, next }) => {
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
          "Total-Count": "150",
        },
      });
    }
  });
  await page.goto("/search?query=Next.js&qiitapage=1&zennpage=2");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  await page.screenshot({ path: "screenshot-1.png", fullPage: true });
  const activeButton = qiitaArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(qiitaArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "5", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
});
