import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Kripto Saat - 加密货币新闻和市场分析',
  description: '获取最新的加密货币新闻、市场分析和区块链技术资讯',
  openGraph: {
    title: 'Kripto Saat - 加密货币新闻和市场分析',
    description: '获取最新的加密货币新闻、市场分析和区块链技术资讯',
    type: 'website',
  },
};

export default function HomePage() {
  // 在生產環境中，這個頁面不應該被訪問
  // 因為用戶會通過 kriptosaat.com/flash/ 訪問快訊系統
  // 這裡做一個重定向以防萬一
  redirect('/flash');
}
