import { QiitaItem, ZennItem } from "@/types/types";

const getQiitaDateRange = (articles: QiitaItem[]): { start: string | null; end: string | null } => {
  const start = articles[articles.length - 1].created_at;
  const end = articles[0].created_at;

  return { start, end };
};

const getZennDateRange = (articles: ZennItem[]): { start: string | null; end: string | null } => {
  const start = articles[articles.length - 1].published_at;
  const end = articles[0].published_at;

  return { start, end };
};

export const getArticleDateRange = (
  articles: QiitaItem[] | ZennItem[]
): { start: string | null; end: string | null } => {
  if (articles.length === 0) {
    return { start: null, end: null };
  }

  const isQiitaItem = (item: QiitaItem | ZennItem): item is QiitaItem => {
    return "url" in item;
  };

  return isQiitaItem(articles[0])
    ? getQiitaDateRange(articles as QiitaItem[])
    : getZennDateRange(articles as ZennItem[]);
};
