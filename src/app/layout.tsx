import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kripto Saat - 土耳其領先的數字貨幣投資理財、快訊、深度分析、市場行情資訊平台",
  description: "Kripto Saat - 土耳其領先的比特幣等數字貨幣投資理財、快訊、深度分析、市場行情資訊平台。",
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
