import { Metadata } from 'next';
import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import { FlashListContainer } from '@/components/flash/FlashListContainer';

export const metadata: Metadata = {
  title: 'Kripto Saat Flash - En Son Kripto Para Haberleri',
  description: 'Bitcoin, Ethereum, DeFi ve NFT dünyasından anlık haberler ve gelişmeler. Kripto para piyasasındaki son durumu takip edin.',
  keywords: ['kripto para', 'bitcoin', 'ethereum', 'defi', 'nft', 'blockchain', 'türkiye'],
  openGraph: {
    title: 'Kripto Saat Flash - En Son Kripto Para Haberleri',
    description: 'Bitcoin, Ethereum, DeFi ve NFT dünyasından anlık haberler ve gelişmeler.',
    url: `${config.site.url}/flash`,
    siteName: config.site.name,
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kripto Saat Flash - En Son Kripto Para Haberleri',
    description: 'Bitcoin, Ethereum, DeFi ve NFT dünyasından anlık haberler ve gelişmeler.',
    site: config.seo.twitterHandle,
  },
  alternates: {
    canonical: `${config.site.url}/flash`,
  },
};

export default async function FlashHomePage() {
  try {
    // SSR: 獲取第一頁快訊數據
    const initialData = await apiService.getHotFlashes(1, config.api.itemsPerPage);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Flash Haberler
          </h1>
          <p className="text-muted-foreground">
            Kripto para dünyasından en güncel haberler ve gelişmeler
          </p>
        </div>

        {/* 快訊列表容器 - 支援無限滾動 */}
        <FlashListContainer initialData={initialData} />
      </div>
    );
  } catch (error) {
    console.error('Error loading flash page:', error);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Bir Hata Oluştu
          </h1>
          <p className="text-muted-foreground mb-4">
            Flash haberler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }
}

// 靜態生成配置
export const revalidate = 60; // 60秒重新驗證
export const dynamic = 'force-dynamic'; // 強制動態渲染確保數據即時性 