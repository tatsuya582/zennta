import { type Provider } from "@supabase/supabase-js";
import { type ReactNode } from "react";

export type SigninButtonProps = {
  provider: Provider;
  children: ReactNode;
};