import { QiitaItem } from "@/types/types";

export const getQiitaCreatedAtRange = (articles: QiitaItem[]): { start: string | null; end: string | null } => {
  if (articles.length === 0) {
    return { start: null, end: null };
  }

  const start = articles[articles.length - 1].created_at;
  const end = articles[0].created_at;

  return { start, end };
};
