import { Metadata } from 'next';
import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FlashNewsCard from '@/components/flash/FlashNewsCard';
import MarketSidebar from '@/components/market/MarketSidebar';
import FloatingButtons from '@/components/ui/FloatingButtons';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '快訊 - 幣世界',
  description: 'Bitcoin, Ethereum, DeFi ve NFT dünyasından anlık haberler ve gelişmeler. Kripto para piyasasındaki son durumu takip edin.',
  keywords: ['kripto para', 'bitcoin', 'ethereum', 'defi', 'nft', 'blockchain', 'türkiye'],
  openGraph: {
    title: '快訊 - 幣世界',
    description: 'Bitcoin, Ethereum, DeFi ve NFT dünyasından anlık haberler ve gelişmeler.',
    url: `${config.site.url}/flash`,
    siteName: config.site.name,
    type: 'website',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: '快訊 - 幣世界',
    description: 'Bitcoin, Ethereum, DeFi ve NFT dünyasından anlık haberler ve gelişmeler.',
    site: config.seo.twitterHandle,
  },
  alternates: {
    canonical: `${config.site.url}/flash`,
  },
};

interface FlashPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function FlashPage({ searchParams }: FlashPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  
  try {
    // 獲取快訊數據
    const flashData = await apiService.getHotFlashes(page, config.api.itemsPerPage);
    
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

              {/* Pagination */}
              <div className="bg-white rounded-b-lg px-6 py-4">
                <div className="flex items-center justify-between">
                  {flashData.pagination.hasPrev && (
                    <Link 
                      href={`/flash?page=${page - 1}`}
                      className="text-[#5B7BFF] hover:text-[#4a6ae6] text-sm font-normal inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      上一页
                    </Link>
                  )}
                  
                  <span className="text-sm text-[#999]">
                    第 {flashData.pagination.page} 页，共 {flashData.pagination.totalPages} 页
                  </span>
                  
                  {flashData.pagination.hasNext && (
                    <Link 
                      href={`/flash?page=${page + 1}`}
                      className="text-[#5B7BFF] hover:text-[#4a6ae6] text-sm font-normal inline-flex items-center gap-2"
                    >
                      下一页
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
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
  } catch (error) {
    console.error('Error loading flash page:', error);
    
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />
        
        <main className="max-w-[1200px] mx-auto px-4 py-8 flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#333] mb-4">
              发生错误
            </h1>
            <p className="text-[#666] mb-4">
              载入快讯时发生错误，请稍后再试。
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#5B7BFF] text-white px-4 py-2 rounded-md hover:bg-[#4a6ae6] transition-colors"
            >
              重新载入
            </button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
}

// 靜態生成配置
export const revalidate = 60; // 60秒重新驗證
export const dynamic = 'force-dynamic'; // 強制動態渲染確保數據即時性 