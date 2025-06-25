import { NextResponse } from 'next/server';
import { MOCK_MODE } from '@/data/mock';
import { apiService } from '@/lib/api';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      MOCK_MODE_ENABLED: process.env.MOCK_MODE_ENABLED,
      NODE_ENV: process.env.NODE_ENV,
      MOCK_MODE_CONFIG: MOCK_MODE.enabled,
      API_SERVICE_MOCK_MODE: apiService.getMockMode(),
      timestamp: new Date().toISOString(),
    },
  });
} 