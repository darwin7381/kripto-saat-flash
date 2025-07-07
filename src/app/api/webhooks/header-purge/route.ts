import { NextRequest, NextResponse } from 'next/server';

const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// STRAPI Webhook 端點：Header 內容變動時清除相關快取
export async function POST(request: NextRequest) {
  try {
    // 驗證請求來源（可選：加入 webhook secret 驗證）
    const body = await request.json();
    
    // 記錄 webhook 觸發
    console.log('Header content changed, purging Cloudflare cache:', {
      model: body.model,
      entry: body.entry?.id,
      timestamp: new Date().toISOString()
    });

    // 清除 Cloudflare 快取
    if (CLOUDFLARE_ZONE_ID && CLOUDFLARE_API_TOKEN) {
      await purgeCloudflareCache([
        'header-config',
        'header-v2',
        'header-navigation-new', 
        'header-global',
        'header-fallback'
      ]);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Header cache purged successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Header cache purge failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Cache purge failed' 
    }, { status: 500 });
  }
}

// Cloudflare 快取清除函數
async function purgeCloudflareCache(tags: string[]) {
  if (!CLOUDFLARE_ZONE_ID || !CLOUDFLARE_API_TOKEN) {
    console.warn('Cloudflare credentials not configured, skipping cache purge');
    return;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tags
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Cloudflare cache purged successfully:', result);
    
  } catch (error) {
    console.error('Failed to purge Cloudflare cache:', error);
    throw error;
  }
} 