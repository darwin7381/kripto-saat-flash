import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');

    // 驗證slug參數
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid slug parameter' 
        },
        { status: 400 }
      );
    }

    const flashListResponse = await apiService.getCategoryFlashes(slug, page);

    const response = NextResponse.json({
      success: true,
      data: flashListResponse,
      meta: {
        mode: apiService.getMockMode() ? 'mock' : 'live',
        timestamp: new Date().toISOString(),
        categorySlug: slug,
        page,
      },
    });

    // 設置快取headers - 分類頁面短期快取
    response.headers.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    response.headers.set('CDN-Cache-Control', 'public, max-age=3600');
    
    // 設置快取標籤用於精確清除
    const cacheTag = `categories-${encodeURIComponent(slug)},flashes-category-${encodeURIComponent(slug)},flashes-list`;
    response.headers.set('Cache-Tag', cacheTag);
    
    return response;

  } catch (error) {
    console.error('Error fetching category flashes:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        meta: {
          mode: apiService.getMockMode() ? 'mock' : 'live',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
} 