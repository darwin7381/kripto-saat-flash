import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FlashCard } from '@/components/flash/FlashCard';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import { Flash } from '@/types/flash';
import ClientLayout from '@/components/layout/ClientLayout';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const category = await apiService.getCategory(slug);
    
    if (!category) {
      return {
        title: '分類不存在',
        description: '您要查看的分類不存在',
      };
    }

    return {
      title: `${category.name} | Kripto Saat Flash`,
      description: category.description || `查看所有關於${category.name}的加密貨幣快訊`,
      keywords: [category.name, '加密貨幣', '快訊', 'Kripto Saat'],
      openGraph: {
        title: `${category.name} - 加密貨幣快訊`,
        description: category.description || `查看所有關於${category.name}的加密貨幣快訊`,
        url: `${config.site.url}/flash/category/${category.slug}`,
        siteName: config.site.name,
        type: 'website',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: '分類不存在',
      description: '您要查看的分類不存在',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');
  
  try {
    const [category, flashListResponse] = await Promise.all([
      apiService.getCategory(slug),
      apiService.getCategoryFlashes(slug, page)
    ]);
    
    if (!category) {
      notFound();
    }

    const { flashes, pagination } = flashListResponse;

    return (
      <ClientLayout>
        <div className="max-w-[1200px] mx-auto px-[15px] py-8">
          <div className="mb-8">
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
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link 
            href="/flash" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回快訊列表
          </Link>

            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground text-lg">{category.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              共找到 {pagination.total.toLocaleString()} 條相關快訊
            </p>
          </div>

          {flashes.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashes.map((flash: Flash) => (
                  <FlashCard key={flash.id} flash={flash} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  {pagination.hasPrev && (
                    <Link href={`/flash/category/${slug}?page=${page - 1}`}>
                      <Button variant="outline">上一頁</Button>
                    </Link>
                  )}
                  
                  <span className="text-sm text-muted-foreground">
                    第 {pagination.page} 頁，共 {pagination.totalPages} 頁
                  </span>
                  
                  {pagination.hasNext && (
                    <Link href={`/flash/category/${slug}?page=${page + 1}`}>
                      <Button variant="outline">下一頁</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">此分類暫無快訊內容</p>
              <Link href="/flash" className="mt-4 inline-block">
                <Button>瀏覽所有快訊</Button>
              </Link>
            </div>
          )}
        </div>
      </ClientLayout>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
} 