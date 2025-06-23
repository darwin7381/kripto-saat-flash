import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { segmentId: string } }
) {
  try {
    const segmentId = parseInt(params.segmentId, 10);

    if (isNaN(segmentId) || segmentId < 1) {
      return NextResponse.json(
        { error: 'Invalid segment ID' },
        { status: 400 }
      );
    }

    const data = await apiService.getSegmentFlashes(segmentId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching segment flashes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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