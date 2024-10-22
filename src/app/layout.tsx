import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Zennta",
    default: "Zennta"
  },
  description:
    "ZennやQiitaのAPIを利用して記事一覧や検索を同時にできるサービスです。読んだ履歴や後で読む、お気に入りなどができます。",
  openGraph: {
    title: "Zennta",
    description:
      "ZennやQiitaのAPIを利用して記事一覧や検索を同時にできるサービスです。読んだ履歴や後で読む、お気に入りなどができます。",
    type: "website",
    url: "https://zennta.vercel.app/",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "Zennta",
    description:
      "ZennやQiitaのAPIを利用して記事一覧や検索を同時にできるサービスです。読んだ履歴や後で読む、お気に入りなどができます。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
