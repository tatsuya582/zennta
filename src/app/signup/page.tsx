import { AuthForm } from "@/components/layout/form/authForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "会員登録",
};

export default function SignupPage() {
  return <AuthForm type="signup" />;
}
