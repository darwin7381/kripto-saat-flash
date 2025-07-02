/**
 * 統一快取策略中間件
 * 
 * 基於 requirement_Draft.md 和 nextjs-flash-system-guide.md 的設計：
 * - 永久快取（無TTL）+ Webhook主動清理
 * - 防範攻擊：避免TTL快取被繞過的安全問題
 * - 即時性：確保快訊立即可見，無延遲
 * - 業界標準：大型網站標準做法
 */

import { NextResponse } from 'next/server';

export interface CacheOptions {
  /**
   * 快取標籤，用於精確清除
   * 例如：['flashes-hot', 'flashes-page-1', 'flashes-latest']
   */
  tags: string[];
  
  /**
   * 快取類型，決定快取策略
   */
  type: 'hot' | 'cold' | 'updates' | 'category';
  
  /**
   * 額外的快取參數（可選）
   */
  params?: Record<string, string | number>;
}

/**
 * 為NextResponse添加統一的快取headers
 * 實現永久快取 + 主動清理架構
 */
export function setCacheHeaders(response: NextResponse, options: CacheOptions): NextResponse {
  // 1. 永久快取設置（核心原則：無TTL，依賴Webhook清除）
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  response.headers.set('CDN-Cache-Control', 'public, max-age=31536000');
  
  // 2. 設置快取標籤用於精確清除（支援Cloudflare Cache Tag清除）
  const cacheTagString = options.tags.join(',');
  response.headers.set('Cache-Tag', cacheTagString);
  
  // 3. 添加快取類型標識（便於監控和調試）
  response.headers.set('X-Cache-Type', options.type);
  
  // 4. 添加時間戳標識（便於追蹤快取生成時間）
  response.headers.set('X-Cache-Generated', new Date().toISOString());
  
  return response;
}

/**
 * Hot Data 快取標籤生成器
 * 用於熱門頁面API（前10頁，頻繁更新）
 */
export function generateHotCacheTags(page: number, limit: number): string[] {
  return [
    'flashes-hot',              // 全域熱門標籤
    `flashes-page-${page}`,     // 特定頁面標籤  
    'flashes-latest',           // 最新內容標籤
    `flashes-limit-${limit}`,   // 分頁大小標籤
  ];
}

/**
 * Cold Data 快取標籤生成器  
 * 用於歷史區段API（穩定內容，極少更新）
 */
export function generateColdCacheTags(segmentId: number): string[] {
  return [
    'flashes-cold',                    // 全域歷史標籤
    `flashes-segment-${segmentId}`,    // 特定區段標籤
    'flashes-historical',              // 歷史內容標籤
  ];
}

/**
 * Updates 快取標籤生成器
 * 用於更新檢查API（1分鐘輪詢，新內容時立即清除）
 */
export function generateUpdatesCacheTags(lastId: number): string[] {
  return [
    'flashes-updates',              // 全域更新標籤
    `flashes-check-${lastId}`,      // 特定檢查點標籤
    'flashes-latest',               // 最新內容標籤（與Hot共用）
  ];
}

/**
 * Category 快取標籤生成器
 * 用於分類頁面API
 */
export function generateCategoryCacheTags(categorySlug: string, page?: number): string[] {
  const tags = [
    'flashes-category',                     // 全域分類標籤
    `flashes-category-${categorySlug}`,     // 特定分類標籤
  ];
  
  if (page) {
    tags.push(`flashes-category-${categorySlug}-page-${page}`);
  }
  
  return tags;
}

/**
 * 統一的API響應格式化器
 * 確保所有API返回一致的格式
 */
export function formatApiResponse<T>(
  data: T, 
  success: boolean = true, 
  meta?: Record<string, string | number | boolean>
) {
  return {
    success,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

/**
 * 錯誤響應格式化器
 * 統一錯誤處理格式
 */
export function formatErrorResponse(
  error: string, 
  status: number = 500,
  meta?: Record<string, string | number | boolean>
) {
  return NextResponse.json(
    {
      success: false,
      error,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

/**
 * 根據需求文檔的快取清除策略常數
 */
export const CACHE_CLEAR_SCENARIOS = {
  // 單頁更新：新增/修改快訊（550次/天）
  SINGLE_UPDATE: 'single_update',
  
  // 歷史單頁更新：歷史內容修改（50次/月）
  HISTORICAL_UPDATE: 'historical_update',
  
  // 刪除文章：推送404（10次/天）
  DELETE_ARTICLE: 'delete_article',
  
  // 樣式大改：全域樣式更新（2次/年）
  STYLE_UPDATE: 'style_update',
  
  // 快取重建：全失效重建（20次/年，高估20倍）
  CACHE_REBUILD: 'cache_rebuild',
} as const;

/**
 * 快取清除標籤映射
 * 定義不同場景需要清除的快取標籤
 */
export const CACHE_CLEAR_TAGS = {
  [CACHE_CLEAR_SCENARIOS.SINGLE_UPDATE]: [
    'flashes-hot',      // 清除熱門頁面
    'flashes-latest',   // 清除最新內容檢查
    'flashes-updates',  // 清除更新檢查
  ],
  
  [CACHE_CLEAR_SCENARIOS.HISTORICAL_UPDATE]: [
    'flashes-cold',     // 只清除特定歷史區段
  ],
  
  [CACHE_CLEAR_SCENARIOS.DELETE_ARTICLE]: [
    'flashes-hot',      // 清除熱門頁面
    'flashes-cold',     // 清除相關歷史區段
    'flashes-latest',   // 清除最新內容檢查
  ],
  
  [CACHE_CLEAR_SCENARIOS.STYLE_UPDATE]: [
    // 樣式更新不清除內容快取，只推送新CSS/JS
  ],
  
  [CACHE_CLEAR_SCENARIOS.CACHE_REBUILD]: [
    'flashes-hot',
    'flashes-cold', 
    'flashes-updates',
    'flashes-category',
    'flashes-latest',
    'flashes-historical',
  ],
} as const; 