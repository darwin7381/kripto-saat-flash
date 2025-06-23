import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api';

interface RouteParams {
  params: {
    segmentId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const segmentId = parseInt(params.segmentId);

    // 驗證區段ID
    if (isNaN(segmentId) || segmentId < 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid segment ID. Must be a positive integer' 
        },
        { status: 400 }
      );
    }

    // 驗證區段ID是否在有效範圍內（防範攻擊）
    // 這裡可以加入更多驗證邏輯，比如檢查區段是否存在
    const result = await apiService.getSegmentFlashes(segmentId);

    // 設置快取headers - 永久快取，歷史區段內容穩定
    const response = NextResponse.json({
      success: true,
      data: result,
      meta: {
        mode: apiService.getMockMode() ? 'mock' : 'live',
        timestamp: new Date().toISOString(),
      },
    });

    // CDN快取設置 - 歷史區段永久快取
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
    
    // 設置快取標籤用於精確清除
    response.headers.set('Cache-Tag', `flashes-segment,flashes-segment-${segmentId},flashes-historical`);
    
    return response;

  } catch (error) {
    console.error('Error fetching segment flashes:', error);
    
    // 如果是區段不存在，返回404
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Segment not found',
          meta: {
            mode: apiService.getMockMode() ? 'mock' : 'live',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }
    
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