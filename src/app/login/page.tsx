import { AuthForm } from "@/components/layout/form/authForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return <AuthForm type="login" />;
}
