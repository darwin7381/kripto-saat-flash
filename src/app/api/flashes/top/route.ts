import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || config.api.itemsPerPage.toString());

    // 驗證參數
    if (page < 1 || page > config.api.hotPagesLimit) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid page number. Must be between 1 and ${config.api.hotPagesLimit}` 
        },
        { status: 400 }
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid limit. Must be between 1 and 100' 
        },
        { status: 400 }
      );
    }

    const result = await apiService.getHotFlashes(page, limit);

    // 設置快取headers - 永久快取，依賴Webhook清除
    const response = NextResponse.json({
      success: true,
      data: result,
      meta: {
        mode: apiService.getMockMode() ? 'mock' : 'live',
        timestamp: new Date().toISOString(),
      },
    });

    // CDN快取設置 - 熱門頁面永久快取
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
    
    // 設置快取標籤用於精確清除
    response.headers.set('Cache-Tag', `flashes-hot,flashes-page-${page},flashes-latest`);
    
    return response;

  } catch (error) {
    console.error('Error fetching hot flashes:', error);
    
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

// 支援CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 