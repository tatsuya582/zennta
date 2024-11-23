import { type Provider } from "@supabase/supabase-js";
import { type ReactNode } from "react";

export type SigninButtonProps = {
  provider: Provider;
  children: ReactNode;
};

export type ProfilePageLayoutProps = {
  title: string;
  isEdit: boolean;
};

export type QiitaItem = {
  id: string;
  title: string;
  url: string;
  tags: Tag[];
  created_at: string; // ISO 8601 format, e.g., "2000-01-01T00:00:00+00:00"
};

export type Tag = {
  name: string;
};

export type QiitaArticlesResponse = {
  articles: QiitaItem[];
  totalPage: number;
};

export type ZennItem = {
  id: number;
  title: string;
  path: string;
  published_at: string;
};

export type zennArticlesResponse = {
  articles: ZennItem[];
  next_page: number | null;
};

export type History = {
  updatedAt: string;
  articles: DisplayItem;
};

export type DisplayItem = {
  id: string;
  url: string;
  tags: Tag[] | null;
  title: string;
};
