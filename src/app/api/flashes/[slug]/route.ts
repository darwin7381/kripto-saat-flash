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

    const flash = await apiService.getFlash(slug);

    if (!flash) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Flash not found',
          meta: {
            timestamp: new Date().toISOString(),
            slug,
          },
        },
        { status: 404 }
      );
    }

    // 獲取相關快訊
    const relatedFlashes = await apiService.getRelatedFlashes(flash.id, 5);

    // 設置快取headers - 快訊內容永久快取
    const response = NextResponse.json({
      success: true,
      data: {
        flash,
        relatedFlashes,
      },
      meta: {
        timestamp: new Date().toISOString(),
        slug,
        relatedCount: relatedFlashes.length,
      },
    });

    // CDN快取設置 - 快訊詳情永久快取
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
    
    // 設置快取標籤用於精確清除 - 避免中文字符
    const cacheTag = `flashes-detail,flashes-${flash.id},flashes-slug-${encodeURIComponent(slug)}`;
    response.headers.set('Cache-Tag', cacheTag);
    
    return response;

  } catch (error) {
    console.error('Error fetching flash detail:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
} 