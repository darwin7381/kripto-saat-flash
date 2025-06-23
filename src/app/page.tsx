import { Metadata } from 'next';
import { apiService } from '@/lib/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FlashNewsCard from '@/components/flash/FlashNewsCard';
import MarketSidebar from '@/components/market/MarketSidebar';
import FloatingButtons from '@/components/ui/FloatingButtons';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '比特币资讯网_区块链快讯_数字货币资讯 -币世界|币圈事早知道',
  description: '币世界网-比特币等数字货币交易所导航、投资理财、快讯、深度、币圈、市场行情第一站。',
};

export default async function HomePage() {
  // 獲取快訊數據
  const flashData = await apiService.getHotFlashes(1, 10);
  
  // 獲取今天的日期
  const today = new Date();
  const dateString = today.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit',
    weekday: 'long'
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-6 flex-1 w-full">
        <div className="flex gap-5">
          {/* Left Column - News */}
          <div className="flex-1 max-w-[820px]">
            {/* News Header */}
            <div className="bg-white rounded-t-lg border-b border-[#e8e8e8] px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-[18px] font-normal text-[#333]">币世界快讯</h1>
                <div className="flex items-center border border-[#ddd] rounded px-3 py-1.5">
                  <input 
                    type="text" 
                    placeholder="输入关键字" 
                    className="text-sm outline-none bg-transparent w-32 placeholder-[#999]"
                  />
                  <svg className="w-4 h-4 text-[#999] ml-2 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Header */}
            <div className="bg-[#f9f9f9] px-6 py-2 border-b border-[#e8e8e8]">
              <span className="text-xs text-[#999]">今天 ，{dateString}</span>
            </div>

            {/* News List */}
            <div className="bg-white rounded-b-lg">
              {flashData.flashes.map((flash) => (
                <FlashNewsCard 
                  key={flash.id} 
                  flash={flash} 
                  isImportant={flash.isImportant}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="bg-white rounded-b-lg px-6 py-4 text-center border-t border-[#e8e8e8]">
              <Link 
                href="/flash" 
                className="text-[#5B7BFF] hover:text-[#4a6ae6] text-sm font-normal inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                加载更多
              </Link>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-[340px] hidden lg:block">
            <MarketSidebar />
          </div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
