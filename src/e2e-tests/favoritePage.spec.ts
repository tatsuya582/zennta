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

    if (request.method === "PATCH") {
      return new Response(null, { status: response.status });
    }

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

// test("should display pagination", async ({ page, next }) => {
//   next.onFetch(async (request) => {
//     if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
//       return new Response(
//         JSON.stringify({
//           articles: generateMockFavoriteArticles(favoritePage, favoritePerPage),
//           total_count: 3000,
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
//   const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
//   await expect(activeButton).toHaveCount(2);
//   await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

//   await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
//   await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
//   await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).toHaveCount(2);
//   await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).toHaveCount(2);
//   await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).toHaveCount(2);
// });

// test("should display pagination when less article", async ({ page, next }) => {
//   next.onFetch(async (request) => {
//     if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
//       return new Response(
//         JSON.stringify({
//           articles: generateMockFavoriteArticles(favoritePage, favoritePerPage),
//           total_count: 120,
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
//   const activeButton = favoriteArticles.getByRole("link", { name: "1", exact: true });
//   await expect(activeButton).toHaveCount(2);
//   await expect(activeButton.first()).toHaveAttribute("aria-current", "page");

//   await expect(favoriteArticles.getByRole("link", { name: "2", exact: true })).toHaveCount(2);
//   await expect(favoriteArticles.getByRole("link", { name: "3", exact: true })).toHaveCount(2);
//   await expect(favoriteArticles.getByRole("link", { name: "4", exact: true })).toHaveCount(2);
//   await expect(favoriteArticles.locator(".sr-only", { hasText: "More pages" })).not.toBeVisible();
//   await expect(favoriteArticles.getByRole("link", { name: "Go to next page" })).not.toBeVisible();
//   await expect(favoriteArticles.getByRole("link", { name: "Go to the last page" })).not.toBeVisible();
// });

test("Clicking the add memo button will display a dialogue", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: generateMockFavoriteArticles(favoritePage, favoritePerPage),
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
  await page.goto("/favorite");

  const addMemoButton = await page.locator("button", { hasText: "メモを追加" });
  addMemoButton.first().click();

  const dialog = await page.getByRole("dialog");
  await expect(dialog.locator("h2", { hasText: "メモを入力してください" })).toBeVisible();
  await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "追加" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
});

test("Clicking the add memo button will display a dialogue when have a memo", async ({ page, next }) => {
  next.onFetch(async (request) => {
    if (request.url === `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/fetch_favorites_articles_with_count`) {
      return new Response(
        JSON.stringify({
          articles: [
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
          ],
          total_count: 1,
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
  const editButton = favoriteArticles.locator("button", { hasText: "メモを編集" });
  await expect(editButton).toBeVisible();
  await expect(favoriteArticles.locator("button", { hasText: "メモを削除" })).toBeVisible();
  await expect(favoriteArticles.locator("text=test")).toBeVisible();
  editButton.click();

  const dialog = await page.getByRole("dialog");
  await expect(dialog.locator("h2", { hasText: "メモを入力してください" })).toBeVisible();
  await expect(dialog.locator("p", { hasText: "280文字まで入力できます。" })).toBeVisible();
  await expect(dialog.locator("text=test")).toBeVisible();
  await expect(dialog.locator("button", { hasText: "追加" })).not.toBeVisible();
  await expect(dialog.locator("button", { hasText: "編集" })).toBeVisible();
  await expect(dialog.locator("button", { hasText: "キャンセル" })).toBeVisible();
});

test("Test the button behavior", async ({ page }) => {
  await page.goto("/");

  // テスト用の記事をお気に入りに追加
  const qiitaArticles = await page.getByTestId("qiita-articles");
  await qiitaArticles.locator("text=お気に入り登録").first().click();
  await page.waitForLoadState();

  await expect(qiitaArticles.getByRole("button", { name: "loading" })).toBeVisible();
  await page.waitForLoadState();

  await expect(qiitaArticles.locator("text=お気に入り済み")).toBeVisible();

  const header = await page.getByTestId("header");
  await header.locator("text=お気に入り").first().click();
  await page.waitForLoadState();

  await expect(page.locator("h2", { hasText: "お気に入り" })).toBeVisible();
  await expect(page.locator("text=Sample Qiita Article Title 1")).toBeVisible();

  // メモを追加の挙動をテスト
  const addMemoButton = await page.getByRole("button", { name: "メモを追加" }).first();
  addMemoButton.click();

  const dialog = await page.getByRole("dialog");
  await page.fill('textarea[name="value"]', "test");

  const addButton = await dialog.locator("button", { hasText: "追加" });
  addButton.click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "メモを追加しました" })).toBeVisible();
  await expect(page.locator("text=test")).toBeVisible();
  await page.waitForLoadState();

  // メモを編集の挙動をテスト
  const editMemoButton = await page.getByRole("button", { name: "メモを編集" }).first();
  await expect(editMemoButton).toBeVisible();

  editMemoButton.click();
  await page.waitForLoadState();
  await expect(dialog.locator("text=test")).toBeVisible();
  await expect(addButton).not.toBeVisible();
  await page.fill('textarea[name="value"]', "edit");
  await dialog.locator("button", { hasText: "編集" }).click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "メモを編集しました" })).toBeVisible();
  await page.waitForLoadState();

  editMemoButton.click();
  await page.waitForLoadState();
  await expect(dialog.locator("text=edit")).toBeVisible();

  // キャンセルの挙動をテスト
  await dialog.locator("button", { hasText: "キャンセル" }).click();
  await page.waitForLoadState();
  await expect(dialog).not.toBeVisible();

  const daleteMemoButton = await page.getByRole("button", { name: "メモを削除" }).first();

  // メモの削除ボタンの挙動をテスト
  daleteMemoButton.click();
  const alertDialog = await page.getByRole("alertdialog");

  await expect(alertDialog.locator("h2", { hasText: "メモを削除" })).toBeVisible();
  await expect(alertDialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();

  const deleteButton = alertDialog.locator("button", { hasText: "削除" });
  await expect(deleteButton).toBeVisible();
  await expect(alertDialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

  deleteButton.click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
  await expect(page.locator("text=edit")).not.toBeVisible();

  // 記事の削除ボタンの挙動をテスト
  await page.locator("button", { hasText: "削除" }).first().click();
  await expect(alertDialog.locator("h2", { hasText: "お気に入りを削除" })).toBeVisible();
  await expect(alertDialog.locator("p", { hasText: "削除してよろしいですか？" })).toBeVisible();
  await expect(deleteButton).toBeVisible();
  await expect(alertDialog.locator("button", { hasText: "キャンセル" })).toBeVisible();

  deleteButton.click();
  await page.waitForLoadState();

  await expect(page.locator("li", { hasText: "削除しました" })).toBeVisible();
  await expect(page.locator("text=Sample Qiita Article Title 1")).not.toBeVisible();
});
