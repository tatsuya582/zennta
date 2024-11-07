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

type qiitaItem = {
  id: string;
  title: string;
  url: string;
  tags: [];
  created_at: string; // ISO 8601 format, e.g., "2000-01-01T00:00:00+00:00"
};
