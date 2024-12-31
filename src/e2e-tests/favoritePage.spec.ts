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

// test("should display favoritepage", async ({ page }) => {
//   await page.goto("/favorite");

//   await expect(page.locator('h2:has-text("お気に入り")')).toBeVisible();
//   await expect(page.locator("text=履歴")).toBeVisible();
//   const searchForm = await page.getByTestId("search-form");
//   await expect(searchForm.getByPlaceholder("検索ワードを入力")).toBeVisible();
//   await expect(searchForm.locator("button", { hasText: "検索" })).toBeVisible();
// });

// test("should display Articles", async ({ page, next }) => {
//   next.onFetch(async (request) => {
//     if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
//       return new Response(
//         JSON.stringify({
//           articles: generateMockFavoriteArticles(favoritePage, favoritePerPage),
//           total_count: 40,
//         }),
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }
//   });

//   await page.goto("/favorite");

//   const favoriteArticles = await page.getByTestId("favorite-articles");
//   await expect(favoriteArticles.getByRole("link", { name: "Favorite Article Title 1", exact: true })).toBeVisible();
//   await expect(favoriteArticles.locator("text=Favorite Article Title 30")).toBeVisible();
//   await expect(favoriteArticles.locator("text=Favorite Article Title")).toHaveCount(30);
//   await expect(favoriteArticles.locator("text=Tag1")).toHaveCount(15);
//   await expect(favoriteArticles.locator("text=Tag2")).toHaveCount(15);
//   await expect(favoriteArticles.locator("text=メモを追加")).toHaveCount(30);
//   await expect(favoriteArticles.locator("text=削除")).toHaveCount(30);
// });

test("should display pagination", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockFavoriteArticles(favoritePage, favoritePerPage),
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

  await page.goto("/favorite");

  const favoriteArticles = await page.getByTestId("favorite-articles");
  const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
});

test("should display pagination when less article", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockFavoriteArticles(favoritePage, favoritePerPage),
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

  await page.goto("/favorite");

  const favoriteArticles = await page.getByTestId("favorite-articles");
  const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
  await expect(activeButton).toHaveCount(2);
  await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

  await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
  await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).not.toBeVisible();
  await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
  await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).not.toBeVisible();
});