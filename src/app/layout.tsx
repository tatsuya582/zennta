import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zennta",
  description: "ZennやQiitaのAPIを利用して記事一覧や検索を同時にできるサービスです。読んだ履歴や後で読む、お気に入りなどができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
