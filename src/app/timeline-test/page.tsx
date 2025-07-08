import ClientLayout from '@/components/layout/ClientLayout';
import { apiService } from '@/lib/api';
import { Flash } from '@/types/flash';
import ResponsiveTimelineContainer from '@/components/flash/ResponsiveTimelineContainer';
import EmbedTimelineContainer from '@/components/flash/EmbedTimelineContainer';

// 獲取快訊資料
async function getFlashesForTest(): Promise<Flash[]> {
  try {
    const flashData = await apiService.getHotFlashes(1, 20);
    return flashData.flashes || [];
  } catch (error) {
    console.error('Error fetching flashes for timeline test:', error);
    return [];
  }
}

export default async function TimelineTestPage() {
  const flashes = await getFlashesForTest();

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

        {/* 響應式 Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-[#333] mb-4 border-b pb-2">響應式 Timeline</h2>
          <div className="bg-white rounded-lg">
            <ResponsiveTimelineContainer flashes={flashes.slice(0, 10)} />
          </div>
        </div>

        {/* Embed Timeline - 沒有日期標籤，日期時間合併顯示 */}
        <div>
          <h2 className="text-lg font-semibold text-[#333] mb-4 border-b pb-2">Embed Timeline</h2>
          <p className="text-[#666] text-sm mb-4">
            特點：適合作為 embed widget 使用，沒有日期頂部標籤，只使用相關快訊的布局方式，日期和時間合併顯示（日期在前，時間在後）
          </p>
          <div className="bg-white rounded-lg">
            <EmbedTimelineContainer flashes={flashes.slice(0, 10)} />
          </div>
        </div>
      </main>
    </ClientLayout>
  );
} 