import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import { Metadata } from 'next';
import { Flash } from '@/types/flash';
import ResponsiveTimelineContainer from '@/components/flash/ResponsiveTimelineContainer';
import EmbedTimelineContainer from '@/components/flash/EmbedTimelineContainer';
import ClientLayout from '@/components/layout/ClientLayout';
import LoadMoreButton from '@/components/flash/LoadMoreButton';
import { ImportantFilterProvider } from '@/components/flash/ImportantFilterContext';

export const metadata: Metadata = {
  title: '響應式 Timeline 測試 - Kripto Saat',
  description: '測試響應式 Timeline 功能',
};

// 30秒重新驗證確保內容更新
export const revalidate = 30;

export default async function TimelineTestPage() {
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#333] mb-2">響應式 Timeline 測試頁面</h1>
          <p className="text-[#666] text-sm mb-4">
            這是用來測試新版響應式 Timeline 組件的頁面。調整瀏覽器寬度來查看不同布局效果：
          </p>
          <div className="bg-[#f5f5f5] rounded-lg p-4 text-sm text-[#666]">
            <div className="mb-2">📱 <strong>手機版/小寬度：</strong> 時間軸在左邊，時間和內容都在右邊（類似相關快訊布局）</div>
            <div>💻 <strong>桌面版/大寬度：</strong> 時間在左邊，時間軸在中間，內容在右邊（原始 FlashNewsCard 布局）</div>
          </div>
        </div>

        {/* 響應式 Timeline - 包含「只看重要」開關和加載更多功能 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#333] mb-4 border-b pb-2">響應式 Timeline（含加載更多）</h2>
          <ImportantFilterProvider>
            <div className="bg-white rounded-lg">
              <ResponsiveTimelineContainer flashes={initialFlashes} isFirstContainer={true} />
            </div>
            
            {/* 加載更多按鈕 - 客戶端組件 */}
            <LoadMoreButton 
              initialHasMore={hasMore}
              lastFlashDate={lastFlashDate}
            />
          </ImportantFilterProvider>
        </div>

        {/* Embed Timeline - 沒有日期標籤，日期時間合併顯示 */}
        <div>
          <h2 className="text-lg font-semibold text-[#333] mb-4 border-b pb-2">Embed Timeline</h2>
          <p className="text-[#666] text-sm mb-4">
            特點：適合作為 embed widget 使用，沒有日期頂部標籤，只使用相關快訊的布局方式，日期和時間合併顯示（日期在前，時間在後）
          </p>
          <div className="bg-white rounded-lg">
            <EmbedTimelineContainer flashes={initialFlashes.slice(0, 10)} />
          </div>
        </div>
      </main>
    </ClientLayout>
  );
} 