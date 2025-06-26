import { NextResponse } from 'next/server';
import { apiService } from '@/lib/api';

export async function GET() {
  try {
    const categories = await apiService.getCategories();

    // 設置快取headers - 分類數據相對穩定，可以較長時間快取
    const response = NextResponse.json({
      success: true,
      data: categories,
      meta: {
        timestamp: new Date().toISOString(),
        count: categories.length,
      },
    });

    // CDN快取設置 - 分類較穩定，可以快取較長時間
    response.headers.set('Cache-Control', 'public, max-age=3600'); // 1小時
    response.headers.set('CDN-Cache-Control', 'public, max-age=3600');
    
    // 設置快取標籤用於精確清除
    response.headers.set('Cache-Tag', 'categories,flashes-categories');
    
    return response;

  } catch (error) {
    console.error('Error fetching categories:', error);
    
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