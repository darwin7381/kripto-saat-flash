import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lastId = parseInt(searchParams.get('lastId') || '0');

    // 驗證參數
    if (isNaN(lastId) || lastId < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid lastId. Must be a non-negative integer' 
        },
        { status: 400 }
      );
    }

    const result = await apiService.checkUpdates(lastId);

    // 設置快取headers - 永久快取，依賴Webhook清除
    const response = NextResponse.json({
      success: true,
      data: result,
      meta: {
        mode: apiService.getMockMode() ? 'mock' : 'live',
        timestamp: new Date().toISOString(),
        lastCheckedId: lastId,
      },
    });

    // CDN快取設置 - 更新檢查API永久快取
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
    
    // 設置快取標籤用於精確清除
    response.headers.set('Cache-Tag', `flashes-updates,flashes-check-${lastId},flashes-latest`);
    
    return response;

  } catch (error) {
    console.error('Error checking updates:', error);
    
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