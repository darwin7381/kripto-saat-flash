import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FlashCard } from '@/components/flash/FlashCard';
import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import { Flash, Category, Tag } from '@/types/flash';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface FlashDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: FlashDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const flash = await apiService.getFlash(slug);
  
  if (!flash) {
    return {
      title: '快訊不存在',
      description: '您要查看的快訊不存在或已被刪除',
    };
  }

  return {
    title: `${flash.title} | Kripto Saat Flash`,
    description: flash.excerpt,
    keywords: [...flash.categories.map(c => c.name), ...flash.tags.map(t => t.name)],
    openGraph: {
      title: flash.title,
      description: flash.excerpt,
      url: `${config.site.url}/flash/${flash.slug}`,
      siteName: config.site.name,
      type: 'article',
      publishedTime: flash.published_at,
      modifiedTime: flash.updated_at,
      authors: [flash.author.name],
      tags: flash.tags.map(t => t.name),
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
      description: flash.excerpt,
      images: flash.featured_image ? [flash.featured_image.url] : undefined,
    },
  };
}

export default async function FlashDetailPage({ params }: FlashDetailPageProps) {
  const { slug } = await params;
  
  const response = await fetch(`${config.site.url}/api/flashes/${slug}`, {
    next: { revalidate: 3600 }, // 1小時重新驗證
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch flash');
  }

  const { data } = await response.json();
  const { flash, relatedFlashes } = data;

  const timeAgo = formatDistanceToNow(new Date(flash.published_at), {
    addSuffix: true,
    locale: zhCN,
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: flash.title,
    description: flash.excerpt,
    image: flash.featured_image?.url,
    datePublished: flash.published_at,
    dateModified: flash.updated_at,
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* 麵包屑導航 */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">首頁</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/flash">快訊</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{flash.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* 返回按鈕 */}
          <Link 
            href="/flash" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回快訊列表
          </Link>

          {/* 快訊內容 */}
          <Card className="mb-8">
            <CardHeader className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight">{flash.title}</h1>
              
              {/* 元資訊 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{flash.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{timeAgo}</span>
                </div>
                {flash.meta.reading_time && (
                  <span>{flash.meta.reading_time} 分鐘閱讀</span>
                )}
                {flash.meta.views && (
                  <span>{flash.meta.views.toLocaleString()} 次瀏覽</span>
                )}
              </div>

              {/* 分類標籤 */}
              <div className="flex flex-wrap gap-2">
                {flash.categories.map((category: Category) => (
                  <Link key={category.id} href={`/flash/category/${category.slug}`}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
                {flash.tags.map((tag: Tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <Badge variant="outline" className="hover:bg-muted transition-colors">
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 特色圖片 */}
              {flash.featured_image && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={flash.featured_image.url}
                    alt={flash.featured_image.alt}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* 快訊內容 */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                  {flash.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 相關快訊 */}
          {relatedFlashes.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">相關快訊</h2>
              <div className="grid gap-6">
                {relatedFlashes.map((relatedFlash: Flash) => (
                  <FlashCard key={relatedFlash.id} flash={relatedFlash} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 