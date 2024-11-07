export const getQiitaArticles = async ({ page }: { page: string }) => {
  try {
    const response = await fetch(`https://qiita.com/api/v2/items?page=${page}&per_page=30`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_QIITA_API_TOKEN!}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Qiita items:", error);
    throw new Error("Failed to fetch articles");
  }
};