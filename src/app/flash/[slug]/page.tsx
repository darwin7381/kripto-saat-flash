import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Share2, MessageCircle, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { config } from '@/lib/config';
import { Flash, Category, Tag as TagType } from '@/types/flash';
import { apiService } from '@/lib/api';
import ClientLayout from '@/components/layout/ClientLayout';
import MarketSidebar from '@/components/market/MarketSidebar';
import FlashImageViewer from '@/components/flash/FlashImageViewer';
import EmbedTimelineContainer from '@/components/flash/EmbedTimelineContainer';

interface FlashDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 移除錯誤的 SSG 配置，使用 SSR + 快取策略
// 原因：內頁數量龐大（幾萬篇），SSG 不適用，但需要支援快取
// ✅ SSR：每次請求時動態渲染，但結果可被 Cloudflare 快取
// ❌ 不使用 force-dynamic，保持快取能力

export async function generateMetadata({ params }: FlashDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    // URL 解碼 slug（處理中文字符）
    const decodedSlug = decodeURIComponent(slug);
    
    // 使用 API 服務獲取快訊
    const flash = await apiService.getFlash(decodedSlug);
    
    if (!flash) {
      return {
        title: '快訊不存在',
        description: '您要查看的快訊不存在或已被刪除',
      };
    }

    return {
      title: `${flash.title} | Kripto Saat Flash`,
      description: flash.content.slice(0, 150) + (flash.content.length > 150 ? '...' : ''),
      keywords: [...flash.categories.map((c: Category) => c.name), ...flash.tags.map((t: TagType) => t.name)],
      openGraph: {
        title: flash.title,
        description: flash.content.slice(0, 150) + (flash.content.length > 150 ? '...' : ''),
        url: `${config.site.url}/flash/${flash.slug}`,
        siteName: config.site.name,
        type: 'article',
        publishedTime: flash.published_datetime,
        modifiedTime: flash.updatedAt,
        authors: [flash.author.name],
        tags: flash.tags.map((t: TagType) => t.name),
        images: flash.featured_image ? [{
          url: flash.featured_image.url,
          width: flash.featured_image.width,
          height: flash.featured_image.height,
          alt: flash.featured_image.alt,
        }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: flash.title,
        description: flash.content.slice(0, 150) + (flash.content.length > 150 ? '...' : ''),
        images: flash.featured_image ? [flash.featured_image.url] : undefined,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '快訊載入失敗',
      description: '無法載入快訊內容',
    };
  }
}

export default async function FlashDetailPage({ params }: FlashDetailPageProps) {
  const { slug } = await params;
  
  // URL 解碼 slug（處理中文字符）
  const decodedSlug = decodeURIComponent(slug);
  
  // 使用 API 服務獲取快訊
  const flash: Flash | null = await apiService.getFlash(decodedSlug);

  if (!flash) {
    notFound();
  }

  // 獲取相關快訊
  const relatedFlashes: Flash[] = await apiService.getRelatedFlashes(flash.id, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 模擬市場標籤數據（實際應該從 API 獲取）
  const getMarketTags = (id: number) => {
    const tags = [
      { name: "BTC", change: "+1.74%", type: "up" },
      { name: "ETH", change: "-2.12%", type: "down" },
      { name: "USDT", change: "+0.01%", type: "up" },
    ];
    return tags.slice(0, (id % 3) + 1);
  };

  const marketTags = getMarketTags(flash.id);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: flash.title,
    description: flash.content.slice(0, 150) + (flash.content.length > 150 ? '...' : ''),
    image: flash.featured_image?.url,
    datePublished: flash.published_datetime,
    dateModified: flash.updatedAt,
    author: {
      '@type': 'Person',
      name: flash.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: config.site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${config.site.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${config.site.url}/flash/${flash.slug}`,
    },
  };

  return (
    <ClientLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="max-w-[1200px] mx-auto px-[15px] py-6 flex-1 w-full">
        <div className="flex gap-6">
          {/* 主要內容區 */}
          <div className="flex-1 max-w-[820px]">
            <div className="bg-white rounded-lg p-6">
              {/* 快訊標題 */}
              <h1 className="text-[26px] font-bold text-[#1a1a1a] leading-[1.5] mb-4">
                {flash.title}
              </h1>

              {/* 作者和時間資訊 */}
              <div className="flex items-center gap-2 text-[14px] text-[#999] mb-6">
                <span className="text-[#666]">{flash.author.name}</span>
                <span>|</span>
                <span>{formatDate(flash.published_datetime)}</span>
              </div>

              {/* 快訊內容 */}
              <div className="text-[16px] text-[#333] leading-[1.8] mb-6 whitespace-pre-wrap">
                {flash.content}
              </div>

              {/* 附件圖片 - 使用客戶端組件 */}
              {flash.featured_image && (
                <div className="mb-6">
                  <FlashImageViewer
                    src={flash.featured_image.url}
                    alt={flash.featured_image.alt || flash.title}
                  />
                </div>
              )}

              {/* 消息來源 - 移到圖片後面、標籤前面 */}
              <div className="mb-6">
                <button className="inline-flex items-center gap-1 text-[14px] text-[#999] hover:text-[#5B7BFF] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>消息來源</span>
                </button>
              </div>

              {/* 幣種標籤 */}
              {marketTags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {marketTags.map((tag, index) => (
                      <Link 
                        key={index}
                        href="#"
                        className={`inline-flex items-center px-[5px] rounded text-[12px] transition-all ${
                          tag.type === 'up' 
                            ? 'bg-[#F6FFFC] text-[#00C087] hover:bg-[#e6fff9]' 
                            : 'bg-[#FFF2F2] text-[#FF4949] hover:bg-[#ffe6e6]'
                        }`}
                      >
                        <span className="font-medium">{tag.name}</span>
                        <span className="ml-1">{tag.change}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 普通標籤 */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {flash.categories.map((category: Category) => (
                    <Link 
                      key={category.id} 
                      href={`/flash/category/${category.slug}`}
                      className="inline-block"
                    >
                      <Badge 
                        variant="secondary" 
                        className="bg-[#f5f5f5] text-[#666] hover:bg-[#e8e8e8] hover:text-[#333] transition-colors px-3 py-1 text-sm font-normal"
                      >
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                  {flash.tags.map((tag: TagType) => (
                    <Link 
                      key={tag.id} 
                      href={`/tag/${tag.slug}`}
                      className="inline-block"
                    >
                      <Badge 
                        variant="outline" 
                        className="border-[#e8e8e8] text-[#666] hover:border-[#5B7BFF] hover:text-[#5B7BFF] transition-colors px-3 py-1 text-sm font-normal"
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 操作按鈕組 */}
              <div className="flex items-center gap-4 text-[14px] border-t border-[#f0f0f0] pt-4">
                {/* 看多 */}
                <button className="flex items-center gap-1 text-[#999] hover:text-[#26a69a] transition-colors group">
                  <div className="flex items-center justify-center w-4 h-4">
                    <ThumbsUp className="w-3.5 h-3.5 group-hover:fill-[#26a69a]" />
                  </div>
                  <span>看多 {flash.bullish_count || 0}</span>
                </button>

                {/* 看空 */}
                <button className="flex items-center gap-1 text-[#999] hover:text-[#ef5350] transition-colors group">
                  <div className="flex items-center justify-center w-4 h-4">
                    <ThumbsDown className="w-3.5 h-3.5 group-hover:fill-[#ef5350]" />
                  </div>
                  <span>看空 {flash.bearish_count || 0}</span>
                </button>

                {/* 分享 */}
                <button className="flex items-center gap-1 text-[#999] hover:text-[#5B7BFF] transition-colors ml-auto">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享</span>
                </button>
              </div>

              <Separator className="my-8" />

              {/* 評論區域 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  評論
                </h3>
                <div className="bg-[#f8f8f8] rounded-lg p-8 text-center text-[#999]">
                  <p>還沒有人評論～快搶沙發吧！</p>
                </div>
              </div>

              {/* 關注提示 */}
              <div className="bg-[#f8f8f8] rounded-lg p-6 text-center">
                <p className="text-[#666] mb-4">關注 Kripto Saat 官方帳號，一起穿越牛熊</p>
                <div className="flex justify-center gap-4">
                  <Badge className="bg-[#5B7BFF] hover:bg-[#4a6aee] text-white px-4 py-2 cursor-pointer">
                    <Link href="#">Kripto Saat 微信群</Link>
                  </Badge>
                  <Badge variant="outline" className="border-[#5B7BFF] text-[#5B7BFF] hover:bg-[#5B7BFF] hover:text-white px-4 py-2 cursor-pointer">
                    <Link href="#">Telegram 交流群</Link>
                  </Badge>
                </div>
              </div>
            </div>

            {/* 相關快訊 */}
            {relatedFlashes.length > 0 && (
              <div className="bg-white rounded-lg mt-4">
                <div className="px-6 py-4 border-b border-[#e8e8e8]">
                  <h3 className="text-[16px] font-normal text-[#333]">相關快訊</h3>
                </div>
                <EmbedTimelineContainer flashes={relatedFlashes.slice(0, 5)} />
              </div>
            )}
          </div>

          {/* Right Sidebar - 市場資訊 */}
          <div className="w-[340px] hidden lg:block">
            <MarketSidebar />
          </div>
        </div>
      </main>
    </ClientLayout>
  );
} 