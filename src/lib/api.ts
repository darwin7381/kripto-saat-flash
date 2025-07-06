import fetchPonyfill from 'fetch-ponyfill';

import { 
  Flash, 
  FlashListResponse, 
  SegmentResponse, 
  UpdateCheckResponse, 
  Category,
  StrapiResponse,
  Author
} from '@/types/flash';
import { HeaderData, HeaderResponse } from '@/types/header';
import { config } from '@/lib/config';

// Safari相容性修復：智能fetch選擇
const getFetch = () => {
  // 在瀏覽器環境使用原生fetch（修復Safari相容性）
  if (typeof window !== 'undefined') {
    return window.fetch.bind(window);
  }
  // 服務器環境使用ponyfill（CloudRun需要）
  const { fetch } = fetchPonyfill();
  return fetch;
};

const fetch = getFetch();

// StrAPI V5 Flash數據結構（直接使用，無需轉換）
interface StrapiFlash {
  id: number;
  documentId: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published_datetime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  is_important?: boolean;
  is_featured?: boolean;
  view_count?: number;
  source_url?: string;
  bullish_count?: number;
  bearish_count?: number;
  author?: {
    id: number;
    documentId: string;
    name: string;
    email?: string;
    bio?: string;
    wp_user_id?: number;
    wp_sync_status?: 'pending' | 'synced' | 'failed';
    social_links?: Record<string, string>;
    avatar?: {
      id: number;
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
      formats?: Record<string, unknown>;
    };
  };
  categories?: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string;
    wp_category_id?: number;
    wp_sync_status?: 'pending' | 'synced' | 'failed';
    display_order?: number;
    is_active?: boolean;
    parent_category?: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  tags?: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description?: string;
    wp_tag_id?: number;
    wp_sync_status?: 'pending' | 'synced' | 'failed';
    usage_count?: number;
    elasticsearch_synced?: boolean;
    color?: string;
    is_active?: boolean;
  }>;
  featured_image?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    formats?: Record<string, unknown>;
  };
}

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = config.strapi.url;
    // Safari相容性：簡化headers配置
    this.headers = {
      'Content-Type': 'application/json',
      // 前端讀取發布內容無需認證，使用公開API
      // 移除User-Agent以確保Safari相容性
    };
  }

  /**
   * 系統一：熱門頁面API (Hot Data - 可變分區)
   * 獲取最新的快訊，支援分頁
   */
  async getHotFlashes(page: number = 1, limit: number = config.api.itemsPerPage): Promise<FlashListResponse> {
    // 限制只能獲取前10頁
    if (page > config.api.hotPagesLimit) {
      throw new ApiError(`Page ${page} exceeds hot pages limit (${config.api.hotPagesLimit})`);
    }

    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': limit.toString(),
      'sort': 'published_datetime:desc',
      'populate': '*',
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    
    const response: FlashListResponse = {
      flashes: data.data.map(item => this.processFlash(item)),
      pagination: {
        page: data.meta.pagination.page,
        limit: data.meta.pagination.pageSize,
        total: data.meta.pagination.total,
        totalPages: data.meta.pagination.pageCount,
        hasNext: data.meta.pagination.page < data.meta.pagination.pageCount,
        hasPrev: data.meta.pagination.page > 1,
      },
    };

    // 如果是最後一頁熱門內容，提供切換信息
    if (page === config.api.hotPagesLimit || page === data.meta.pagination.pageCount) {
      const totalFlashes = data.meta.pagination.total;
      const latestHotPages = config.api.hotPagesLimit * limit;
      const firstSegmentId = Math.ceil((totalFlashes - latestHotPages + 1) / config.api.segmentSize);
      
      response.meta = {
        isLastHotPage: true,
        nextSegmentId: firstSegmentId,
        totalSegments: Math.ceil((totalFlashes - latestHotPages) / config.api.segmentSize),
      };
    }

    return response;
  }

  /**
   * 系統二：歷史區段API (Cold Data - 不可變分區)
   * 獲取指定區段的快訊
   */
  async getSegmentFlashes(segmentId: number): Promise<SegmentResponse> {
    // 計算區段的ID範圍
    const startId = (segmentId - 1) * config.api.segmentSize + 1;
    const endId = segmentId * config.api.segmentSize;

    const params = new URLSearchParams({
      'filters[id][$gte]': startId.toString(),
      'filters[id][$lte]': endId.toString(),
      'sort': 'id:desc',
      'populate': '*',
      'pagination[pageSize]': '100', // 確保獲取全部
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    
    // 獲取總快訊數以計算區段信息
    const totalData = await this.request<StrapiResponse<StrapiFlash[]>>('/api/flashes?pagination[pageSize]=1');
    const totalFlashes = totalData.meta.pagination.total;
    const latestHotPages = config.api.hotPagesLimit * config.api.itemsPerPage;
    const totalSegments = Math.ceil((totalFlashes - latestHotPages) / config.api.segmentSize);

    const flashes = data.data.map(item => this.processFlash(item));
    const deletedIds = this.findDeletedIds(startId, endId, flashes);

    return {
      segmentId,
      flashes,
      previousSegmentId: segmentId < totalSegments ? segmentId + 1 : undefined,
      nextSegmentId: segmentId > 1 ? segmentId - 1 : undefined,
      isLastSegment: segmentId === 1,
      totalSegments,
      activeCount: flashes.length,
      deletedIds,
    };
  }

  /**
   * 檢查更新API
   * 檢查是否有新的快訊發布
   */
  async checkUpdates(lastId: number): Promise<UpdateCheckResponse> {
    const params = new URLSearchParams({
      'filters[id][$gt]': lastId.toString(),
      'pagination[pageSize]': '1',
      'sort': 'published_datetime:desc',
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    const latestFlash = data.data[0];

    return {
      newCount: data.meta.pagination.total,
      latestId: latestFlash ? latestFlash.id : lastId,
      hasUpdates: data.meta.pagination.total > 0,
    };
  }

  /**
   * 獲取單篇快訊詳情
   */
  async getFlash(slug: string): Promise<Flash | null> {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': '*',
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    
    if (data.data.length === 0) {
      return null;
    }

    return this.processFlash(data.data[0]);
  }

  /**
   * 獲取分類快訊
   */
  async getCategoryFlashes(categorySlug: string, page: number = 1): Promise<FlashListResponse> {
    const params = new URLSearchParams({
      'filters[categories][slug][$eq]': categorySlug,
      'pagination[page]': page.toString(),
      'pagination[pageSize]': config.api.itemsPerPage.toString(),
      'sort': 'published_datetime:desc',
      'populate': '*',
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    
    return {
      flashes: data.data.map(item => this.processFlash(item)),
      pagination: {
        page: data.meta.pagination.page,
        limit: data.meta.pagination.pageSize,
        total: data.meta.pagination.total,
        totalPages: data.meta.pagination.pageCount,
        hasNext: data.meta.pagination.page < data.meta.pagination.pageCount,
        hasPrev: data.meta.pagination.page > 1,
      },
    };
  }

  /**
   * 獲取相關快訊
   */
  async getRelatedFlashes(flashId: number, limit: number = 5): Promise<Flash[]> {
    // 基於分類、標籤獲取相關快訊
    const params = new URLSearchParams({
      'filters[id][$ne]': flashId.toString(),
      'pagination[pageSize]': limit.toString(),
      'sort': 'published_datetime:desc',
      'populate': '*',
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    return data.data.map(item => this.processFlash(item));
  }

  /**
   * 獲取所有分類
   */
  async getCategories(): Promise<Category[]> {
    const params = new URLSearchParams({
      'populate': '*',
      'sort': 'display_order:asc',
    });

    const data = await this.request<StrapiResponse<Category[]>>(`/api/categories?${params}`);
    return data.data;
  }

  /**
   * 獲取單個分類
   */
  async getCategory(slug: string): Promise<Category | null> {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': '*',
    });

    const data = await this.request<StrapiResponse<Category[]>>(`/api/categories?${params}`);
    
    if (data.data.length === 0) {
      return null;
    }

    return data.data[0];
  }

  /**
   * 獲取 Header 配置
   */
  async getHeader(): Promise<HeaderData | null> {
    const params = new URLSearchParams({
      'populate[logoLight]': '*',
      'populate[logoDark]': '*',
      'populate[mainNavigation][populate][dropdownItems]': '*',
      'populate[topBar]': '*',
    });

    try {
      const data = await this.request<HeaderResponse>(`/api/header?${params}`);
      
      if (!data.data) {
        return null;
      }

      // 處理圖片URL
      const processedHeader = { ...data.data };
      
      if (processedHeader.logoLight && !processedHeader.logoLight.url.startsWith('http')) {
        processedHeader.logoLight = {
          ...processedHeader.logoLight,
          url: `${this.baseUrl}${processedHeader.logoLight.url}`,
        };
      }
      
      if (processedHeader.logoDark && !processedHeader.logoDark.url.startsWith('http')) {
        processedHeader.logoDark = {
          ...processedHeader.logoDark,
          url: `${this.baseUrl}${processedHeader.logoDark.url}`,
        };
      }

      return processedHeader;
    } catch (error) {
      console.error('Failed to fetch header:', error);
      return null;
    }
  }

  /**
   * 私有方法：發送HTTP請求
   * Safari相容性優化版本
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      // Safari相容性優化：簡化請求配置
      const requestConfig: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        // Safari相容性：避免不必要的options
        ...options,
      };

      // Safari相容性：移除可能導致問題的headers
      if (typeof window !== 'undefined' && requestConfig.headers) {
        // 瀏覽器環境：確保Safari相容性
        const headers = requestConfig.headers as Record<string, string>;
        delete headers['User-Agent'];
      }

      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        throw new ApiError(
          `STRAPI API request failed: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`STRAPI connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 私有方法：處理快訊資料格式化
   */
  private processFlash(flash: StrapiFlash): Flash {
    // 提供預設值以符合 Flash 類型要求
    const defaultAuthor: Author = {
      id: 0,
      name: 'Unknown Author',
    };

    // 處理圖片URL（如果需要加上base URL）
    let processedFeaturedImage = flash.featured_image;
    if (flash.featured_image && !flash.featured_image.url.startsWith('http')) {
      processedFeaturedImage = {
        ...flash.featured_image,
        url: `${this.baseUrl}${flash.featured_image.url}`,
      };
    }

    // 明確返回所有必要字段，避免類型不匹配問題
    return {
      id: flash.id,
      title: flash.title,
      content: flash.content,
      excerpt: flash.excerpt,
      slug: flash.slug,
      published_datetime: flash.published_datetime,
      createdAt: flash.createdAt,
      updatedAt: flash.updatedAt,
      publishedAt: flash.publishedAt,
      is_important: flash.is_important,
      is_featured: flash.is_featured,
      view_count: flash.view_count,
      source_url: flash.source_url,
      bullish_count: flash.bullish_count,
      bearish_count: flash.bearish_count,
      author: flash.author || defaultAuthor,
      categories: flash.categories || [],
      tags: flash.tags || [],
      featured_image: processedFeaturedImage,
    };
  }

  /**
   * 找出區段中被刪除的ID
   */
  private findDeletedIds(startId: number, endId: number, flashes: Flash[]): number[] {
    const existingIds = new Set(flashes.map(f => f.id));
    const deletedIds: number[] = [];
    
    for (let id = startId; id <= endId; id++) {
      if (!existingIds.has(id)) {
        deletedIds.push(id);
      }
    }
    
    return deletedIds;
  }
}

// 導出單例實例
export const apiService = new ApiService(); 