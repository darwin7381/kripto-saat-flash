import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import { Metadata } from 'next';
import { Flash } from '@/types/flash';
import ResponsiveTimelineContainer from '@/components/flash/ResponsiveTimelineContainer';
import ClientLayout from '@/components/layout/ClientLayout';
import LoadMoreButton from '@/components/flash/LoadMoreButton';
import MarketSidebar from '@/components/market/MarketSidebar';

export const metadata: Metadata = {
  title: '币世界快讯 - Kripto Saat',
  description: '获取最新的加密货币快讯和市场动态',
  openGraph: {
    title: '币世界快讯 - Kripto Saat',
    description: '获取最新的加密货币快讯和市场动态',
    type: 'website',
  },
};

// 30秒重新驗證確保內容更新
export const revalidate = 30;

export default async function FlashPage() {
  let initialFlashes: Flash[] = [];
  let hasMore = true;
  let lastFlashDate: string | undefined;
  
  try {
    console.log('SSR: Fetching flashes via apiService (fetch-ponyfill)...');
    
    // ✅ 使用 apiService (fetch-ponyfill) 避免 CloudRun fetch bug
    const flashData = await apiService.getHotFlashes(1, config.api.itemsPerPage);
    
    console.log('SSR: Fetched flashes:', flashData.flashes.length);
    
    // ✅ apiService 直接返回 { flashes: [...], pagination: {...} } 格式
    initialFlashes = flashData.flashes;
    hasMore = flashData.pagination.hasNext;
    
    // 計算最後一篇快訊的發布日期（用於LoadMore日期比較）
    if (initialFlashes.length > 0) {
      lastFlashDate = initialFlashes[initialFlashes.length - 1].published_datetime;
    }
    
    console.log('SSR: Loaded', initialFlashes.length, 'flashes, hasMore:', hasMore);
  } catch (error) {
    console.error('SSR Error:', error);
    initialFlashes = [];
    hasMore = false;
  }

  return (
    <ClientLayout>
      <main className="max-w-[1200px] mx-auto px-[15px] py-6 flex-1 w-full">
        <div className="flex gap-6">
          {/* Left Column - News */}
          <div className="flex-1 max-w-[820px]">
            {/* News Header - SSR 渲染 */}
            <div className="bg-white rounded-lg px-6 py-4 news-header border-b border-[#e8e8e8]">
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

            {/* 快訊列表 - SSR 渲染內容 */}
            <div className="bg-white rounded-lg mt-[-1px]">
              <ResponsiveTimelineContainer flashes={initialFlashes} />
            </div>
            
            {/* 加載更多按鈕 - 客戶端組件 */}
            <LoadMoreButton 
              initialHasMore={hasMore}
              lastFlashDate={lastFlashDate}
            />
          </div>

          {/* Right Sidebar - 混合渲染 */}
          <div className="w-[340px] hidden lg:block">
            <MarketSidebar />
          </div>
        </div>
      </main>
    </ClientLayout>
  );
} 