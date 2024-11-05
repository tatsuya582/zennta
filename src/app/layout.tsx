import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import Header from "@/components/layout/header/Header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | Zennta",
    default: "Zennta",
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
      <body>
        <div>
          <header>
            <Header />
          </header>
          <main className="flex flex-1 max-w-screen-2xl w-full mx-auto">
            <Sidebar />
            <div className="w-full md:ml-auto md:w-3/4 md:p-12 p-4 md:mt-24 mt-12">{children}</div>
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
