import { Database } from "@/types/database.types";

export type ReadLaterArticle = Database["public"]["Tables"]["readLaters"]["Row"] & {
  articles: { url: string; sourceCreatedAt: string } | null;
};