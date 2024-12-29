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

test("should display homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Zennta")).toBeVisible();
  await expect(page.locator("nav a")).toHaveCount(25);
  await expect(page.locator("text=履歴")).toBeVisible();
  await expect(page.locator("text=Qiita一覧")).toBeVisible();
  await expect(page.locator("text=Zenn一覧")).toBeVisible();
  const searchForm = await page.getByTestId("search-form");
  await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
  await expect(searchForm.getByRole("button", { name: "delete" })).toBeVisible();
});

test("The header links are set correctly", async ({ page }) => {
  await page.goto("/");
  const header = await page.getByTestId("header");

  const readLaterLink = await header.locator("text=後で読む");
  readLaterLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("後で読む")')).toBeVisible();
  expect(page.url()).toBe("http://localhost:3000/readlater");

  const favoriteLink = await header.locator("text=お気に入り");
  favoriteLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("お気に入り")')).toBeVisible();
  expect(page.url()).toBe("http://localhost:3000/favorite");

  const searchLink = await header.locator("text=検索");
  searchLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("検索")')).toBeVisible();
  expect(page.url()).toBe("http://localhost:3000/search");

  const profileLink = await header.locator("text=マイページ");
  profileLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("マイページ")')).toBeVisible();
  expect(page.url()).toBe("http://localhost:3000/profile");
});

test("should display Qiita Articles", async ({ page }) => {
  await page.goto("/");
  const qiitaArticles = await page.getByTestId("qiita-articles");
  await expect(qiitaArticles.getByRole("link", { name: "Sample Qiita Article Title 1", exact: true })).toBeVisible();
  await expect(qiitaArticles.locator("text=Sample Qiita Article Title 30")).toBeVisible();
  await expect(qiitaArticles.locator("text=Sample Qiita Article Title")).toHaveCount(30);
  await expect(qiitaArticles.locator("text=Tag1")).toHaveCount(15);
  await expect(qiitaArticles.locator("text=Tag2")).toHaveCount(15);
  await expect(qiitaArticles.locator("text=後で読む")).toHaveCount(30);
  await expect(qiitaArticles.locator("text=お気に入り登録")).toHaveCount(30);
});

test("should display pagination of Qiita Articles", async ({ page }) => {
  await page.goto("/");
  const qiitaArticles = await page.getByTestId("qiita-articles");

  const activeButton = qiitaArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  // ボタンがアクティブになっているかチェック
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(qiitaArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
});

test("should display Zenn Articles", async ({ page }) => {
  await page.goto("/");
  const zennArticles = await page.getByTestId("zenn-articles");
  await expect(zennArticles.getByRole("link", { name: "Sample Zenn Article Title 1", exact: true })).toBeVisible();
  await expect(zennArticles.locator("text=Sample Zenn Article Title 30")).toBeVisible();
  await expect(zennArticles.locator("text=Sample Zenn Article Title")).toHaveCount(30);
  await expect(zennArticles.locator("text=後で読む")).toHaveCount(30);
  await expect(zennArticles.locator("text=お気に入り登録")).toHaveCount(30);
});

test("should display pagination of Zenn Articles", async ({ page }) => {
  await page.goto("/");
  const zennArticles = await page.getByTestId("zenn-articles");

  const activeButton = zennArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(zennArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(zennArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(zennArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(zennArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
  await expect(zennArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
});

test("Qiita article pagination is working correctly", async ({ page }) => {
  await page.goto("/");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const nextPageButton = await qiitaArticles.getByRole("link", { name: "2", exact: true });
  nextPageButton.first().click();
  await page.waitForLoadState();
  await expect(qiitaArticles.locator("text=Sample Qiita Article Title 31")).toBeVisible();
  const activeButton = qiitaArticles.getByRole("link", { name: "2", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");
});

test("The last page of the Qiita article is page 100", async ({ page }) => {
  await page.goto("/");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const zennArticles = await page.getByTestId("zenn-articles");
  const lastPageButton = await qiitaArticles.getByRole("link", { name: "Go to the last page" });
  lastPageButton.first().click();
  await page.waitForLoadState();
  await expect(qiitaArticles.locator("text=Sample Qiita Article Title 3000")).toBeVisible();
  await expect(zennArticles.locator("text=Sample Zenn Article Title 30")).toBeVisible();
  const activeButton = qiitaArticles.getByRole("link", { name: "100", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(qiitaArticles.getByRole("link", { name: "98", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "99", exact: true })).toHaveCount(2);
  await expect(qiitaArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to previous page" })).toHaveCount(2);
  await expect(qiitaArticles.getByRole("link", { name: "Go to the first page" })).toHaveCount(2);
});

test("Zenn article pagination is working correctly", async ({ page }) => {
  await page.goto("/");

  const zennArticles = await page.getByTestId("zenn-articles");
  const nextPageButton = await zennArticles.getByRole("link", { name: "2", exact: true });
  nextPageButton.first().click();
  await page.waitForLoadState();
  await expect(zennArticles.locator("text=Sample Zenn Article Title 31")).toBeVisible();
  const activeButton = zennArticles.getByRole("link", { name: "2", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");
});

test("The last page of the Zenn article is page 100", async ({ page }) => {
  await page.goto("/");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const zennArticles = await page.getByTestId("zenn-articles");
  const lastPageButton = await zennArticles.getByRole("link", { name: "Go to the last page" });
  lastPageButton.first().click();
  await page.waitForLoadState();
  await expect(zennArticles.locator("text=Sample Zenn Article Title 3000")).toBeVisible();
  await expect(qiitaArticles.locator("text=Sample Qiita Article Title 30")).toBeVisible();
  const activeButton = zennArticles.getByRole("link", { name: "100", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(zennArticles.getByRole("link", { name: "98", exact: true })).toHaveCount(2);
  await expect(zennArticles.getByRole("link", { name: "99", exact: true })).toHaveCount(2);
  await expect(zennArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(zennArticles.getByRole("link", { name: "Go to previous page" })).toHaveCount(2);
  await expect(zennArticles.getByRole("link", { name: "Go to the first page" })).toHaveCount(2);
});

test("Read later button works properly", async ({ page }) => {
  await page.goto("/");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const readLaterButton = await qiitaArticles.locator("text=後で読む");
  readLaterButton.first().click();
  await page.waitForLoadState();

  const loadingButton = qiitaArticles.getByRole("button", { name: "loading" });
  await expect(loadingButton).toBeVisible();

  await page.waitForLoadState();
  const registeredButton = await qiitaArticles.locator("text=登録済み");
  await expect(registeredButton).toHaveCount(1, { timeout: 50000 });
  await expect(readLaterButton).toHaveCount(29);

  const header = await page.getByTestId("header");

  const readLaterLink = await header.locator("text=後で読む");
  readLaterLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("後で読む")')).toBeVisible();

  await expect(page.locator("text=Sample Qiita Article Title 1")).toBeVisible();

  await header.locator("text=Zennta").click();
  await page.waitForLoadState();
  await expect(page.locator("text=Qiita一覧")).toBeVisible();

  registeredButton.click();
  await page.waitForLoadState();

  await expect(loadingButton).toBeVisible();

  await page.waitForLoadState();
  await expect(loadingButton).not.toBeVisible();
  await expect(readLaterButton).toHaveCount(30, { timeout: 50000 });

  readLaterLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("後で読む")')).toBeVisible();
  await expect(page.locator("text=Sample Qiita Article Title 1")).not.toBeVisible();
});

test("Favorite button works properly", async ({ page }) => {
  await page.goto("/");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const favoriteButton = await qiitaArticles.locator("text=お気に入り登録");
  favoriteButton.first().click();
  await page.waitForLoadState();

  const loadingButton = qiitaArticles.getByRole("button", { name: "loading" });
  await expect(loadingButton).toBeVisible();

  await page.waitForLoadState();
  const registeredButton = await qiitaArticles.locator("text=お気に入り済み");
  await expect(registeredButton).toHaveCount(1, { timeout: 50000 });
  await expect(favoriteButton).toHaveCount(29);

  const header = await page.getByTestId("header");

  const favoriteLink = await header.locator("text=お気に入り");
  favoriteLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("お気に入り")')).toBeVisible();

  await expect(page.locator("text=Sample Qiita Article Title 1")).toBeVisible();

  await header.locator("text=Zennta").click();
  await page.waitForLoadState();
  await expect(page.locator("text=Qiita一覧")).toBeVisible();

  registeredButton.click();
  await page.waitForLoadState();

  await expect(loadingButton).toBeVisible();

  await page.waitForLoadState();
  await expect(loadingButton).not.toBeVisible();
  await expect(favoriteButton).toHaveCount(30, { timeout: 50000 });

  favoriteLink.first().click();
  await page.waitForLoadState();
  await expect(page.locator('h2:has-text("お気に入り")')).toBeVisible();

  await expect(page.locator("text=Sample Qiita Article Title 1")).not.toBeVisible();
});

test("The article link is correct", async ({ page, context }) => {
  await page.goto("/");

  const zennArticles = await page.getByTestId("zenn-articles");
  const pagePromise = context.waitForEvent("page");
  await zennArticles.locator("text=Sample Zenn Article Title 30").click();
  const newPage = await pagePromise;
  expect(newPage.url()).toBe("https://zenn.dev/zenn-article-30");
});

test("Click on an article to see its history", async ({ page, context }) => {
  await page.goto("/");

  const qiitaArticles = await page.getByTestId("qiita-articles");
  const pagePromise = context.waitForEvent("page");
  await qiitaArticles.locator("text=Sample Qiita Article Title 30").click();
  const newPage = await pagePromise;
  expect(newPage.url()).toBe("https://example.com/qiita-article-30");
  await page.waitForLoadState();

  const asideElement = page.getByRole("complementary", { name: "履歴" });
  await expect(asideElement.locator("text=Sample Qiita Article Title 30")).toBeVisible();
});

test("search form is working properly", async ({ page }) => {
  await page.goto("/");

  const searchForm = await page.getByTestId("search-form");
  await searchForm.getByPlaceholder("検索ワードを入力").fill("Next.js");
  await searchForm.getByRole("button", { name: "delete" }).click();
  await page.waitForLoadState();
  await expect(page.getByRole("button", { name: "loading" })).not.toBeVisible();
  expect(page.url()).toBe("http://localhost:3000/search?query=Next.js");
});

test("Click on a tag to go to the search page", async ({ page }) => {
  await page.goto("/");

  const tagsbutton = await page.locator("text=Tag1");
  tagsbutton.first().click();
  await page.waitForLoadState();

  const searchInput = await page.locator('input[name="name"]');
  await expect(searchInput).toHaveValue("Tag1", { timeout: 50000 });
  expect(page.url()).toBe("http://localhost:3000/search?query=Tag1");
});
