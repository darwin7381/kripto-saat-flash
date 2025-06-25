import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "幣世界 - 比特幣等數字貨幣交易所導航、投資理財、快訊、深度、幣圈、市場行情第一站",
  description: "幣世界網-比特幣等數字貨幣交易所導航、投資理財、快訊、深度、幣圈、市場行情第一站。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
