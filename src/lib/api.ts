import { config } from './config';
import { Flash, FlashListResponse, SegmentResponse, UpdateCheckResponse, Category } from '@/types/flash';
import { MOCK_MODE, mockApiService } from '@/data/mock';

// StrAPI 回應類型定義
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface StrapiItem {
  id: number;
  attributes: Record<string, unknown>;
}

interface StrapiFlashAttributes {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published_at: string;
  updated_at: string;
  views?: number;
  reading_time?: number;
  author?: {
    data?: {
      id: number;
      attributes: {
        name: string;
        email: string;
      };
    };
  };
  categories?: {
    data?: Array<{
      id: number;
      attributes: {
        name: string;
        slug: string;
        wp_category_id?: number;
      };
    }>;
  };
  tags?: {
    data?: Array<{
      id: number;
      attributes: {
        name: string;
        slug: string;
        wp_tag_id?: number;
      };
    }>;
  };
  featured_image?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
        width?: number;
        height?: number;
      };
    };
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
  private useMockData: boolean;

  constructor() {
    this.baseUrl = config.strapi.url;
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.strapi.apiToken && {
        'Authorization': `Bearer ${config.strapi.apiToken}`,
      }),
    };
    this.useMockData = MOCK_MODE.enabled;
  }

  /**
   * 系統一：熱門頁面API (Hot Data - 可變分區)
   * 獲取最新的快訊，支援分頁
   */
  async getHotFlashes(page: number = 1, limit: number = config.api.itemsPerPage): Promise<FlashListResponse> {
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getHotFlashes(page, limit);
    }

    // 真實模式：調用StrAPI
    // 限制只能獲取前10頁
    if (page > config.api.hotPagesLimit) {
      throw new ApiError(`Page ${page} exceeds hot pages limit (${config.api.hotPagesLimit})`);
    }

    const params = new URLSearchParams({
      'pagination[page]': page.toString(),
      'pagination[pageSize]': limit.toString(),
      'sort': 'id:desc',
      'populate': 'author,categories,tags,featured_image',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
    
    const response: FlashListResponse = {
      flashes: data.data.map(item => this.transformFlash(item)),
      pagination: {
        page: data.meta.pagination.page,
        limit: data.meta.pagination.pageSize,
        total: data.meta.pagination.total,
        totalPages: data.meta.pagination.pageCount,
        hasNext: data.meta.pagination.page < Math.min(data.meta.pagination.pageCount, config.api.hotPagesLimit),
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
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getSegmentFlashes(segmentId);
    }

    // 真實模式：調用StrAPI
    // 計算區段的ID範圍
    const startId = (segmentId - 1) * config.api.segmentSize + 1;
    const endId = segmentId * config.api.segmentSize;

    const params = new URLSearchParams({
      'filters[id][$gte]': startId.toString(),
      'filters[id][$lte]': endId.toString(),
      'sort': 'id:desc',
      'populate': 'author,categories,tags,featured_image',
      'pagination[pageSize]': '100', // 確保獲取全部
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
    
    // 獲取總快訊數以計算區段信息
    const totalData = await this.request<StrapiResponse<StrapiItem[]>>('/api/flashes?pagination[pageSize]=1');
    const totalFlashes = totalData.meta.pagination.total;
    const latestHotPages = config.api.hotPagesLimit * config.api.itemsPerPage;
    const totalSegments = Math.ceil((totalFlashes - latestHotPages) / config.api.segmentSize);

    const flashes = data.data.map(item => this.transformFlash(item));
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
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.checkUpdates(lastId);
    }

    // 真實模式：調用StrAPI
    const params = new URLSearchParams({
      'filters[id][$gt]': lastId.toString(),
      'pagination[pageSize]': '1',
      'sort': 'id:desc',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
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
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getFlash(slug);
    }

    // 真實模式：調用StrAPI
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': 'author,categories,tags,featured_image',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
    
    if (data.data.length === 0) {
      return null;
    }

    return this.transformFlash(data.data[0]);
  }

  /**
   * 獲取分類快訊
   */
  async getCategoryFlashes(categorySlug: string, page: number = 1): Promise<FlashListResponse> {
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getCategoryFlashes(categorySlug, page);
    }

    // 真實模式：調用StrAPI
    const params = new URLSearchParams({
      'filters[categories][slug][$eq]': categorySlug,
      'pagination[page]': page.toString(),
      'pagination[pageSize]': config.api.itemsPerPage.toString(),
      'sort': 'published_at:desc',
      'populate': 'author,categories,tags,featured_image',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
    
    return {
      flashes: data.data.map(item => this.transformFlash(item)),
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
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getRelatedFlashes(flashId, limit);
    }

    // 真實模式：調用StrAPI
    // 這裡可以基於分類、標籤或其他邏輯來獲取相關快訊
    const params = new URLSearchParams({
      'filters[id][$ne]': flashId.toString(),
      'pagination[pageSize]': limit.toString(),
      'sort': 'published_at:desc',
      'populate': 'author,categories,tags,featured_image',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
    return data.data.map(item => this.transformFlash(item));
  }

  /**
   * 獲取所有分類
   */
  async getCategories(): Promise<Category[]> {
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getCategories();
    }

    // 真實模式：調用StrAPI
    const data = await this.request<StrapiResponse<Array<StrapiItem & { 
      attributes: {
        name: string;
        slug: string;
        description?: string;
        wp_category_id?: number;
      }
    }>>>('/api/categories');
    
    return data.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      slug: item.attributes.slug,
      description: item.attributes.description,
      wp_category_id: item.attributes.wp_category_id,
    }));
  }

  /**
   * 獲取單個分類
   */
  async getCategory(slug: string): Promise<Category | null> {
    // Mock模式：使用假資料
    if (this.useMockData) {
      return mockApiService.getCategory(slug);
    }

    // 真實模式：調用StrAPI
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { 
      attributes: {
        name: string;
        slug: string;
        description?: string;
        wp_category_id?: number;
      }
    }>>>(`/api/categories?${params}`);
    
    if (data.data.length === 0) {
      return null;
    }

    const item = data.data[0];
    return {
      id: item.id,
      name: item.attributes.name,
      slug: item.attributes.slug,
      description: item.attributes.description,
      wp_category_id: item.attributes.wp_category_id,
    };
  }

  /**
   * 私有方法：發送HTTP請求（僅在真實模式使用）
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 轉換StrAPI數據格式為內部格式（僅在真實模式使用）
   */
  private transformFlash(data: StrapiItem & { attributes: StrapiFlashAttributes }): Flash {
    const attributes = data.attributes;
    
    return {
      id: data.id,
      title: attributes.title,
      content: attributes.content,
      excerpt: attributes.excerpt || '',
      slug: attributes.slug,
      published_at: attributes.published_at,
      updated_at: attributes.updated_at,
      author: {
        id: attributes.author?.data?.id || 0,
        name: attributes.author?.data?.attributes?.name || 'Anonymous',
        email: attributes.author?.data?.attributes?.email || '',
      },
      categories: attributes.categories?.data?.map((cat) => ({
        id: cat.id,
        name: cat.attributes.name,
        slug: cat.attributes.slug,
        wp_category_id: cat.attributes.wp_category_id,
      })) || [],
      tags: attributes.tags?.data?.map((tag) => ({
        id: tag.id,
        name: tag.attributes.name,
        slug: tag.attributes.slug,
        wp_tag_id: tag.attributes.wp_tag_id,
      })) || [],
      featured_image: attributes.featured_image?.data ? {
        url: attributes.featured_image.data.attributes.url,
        alt: attributes.featured_image.data.attributes.alternativeText || '',
        width: attributes.featured_image.data.attributes.width || 0,
        height: attributes.featured_image.data.attributes.height || 0,
      } : undefined,
      meta: {
        views: attributes.views || 0,
        reading_time: attributes.reading_time || 0,
      },
    };
  }

  /**
   * 找出區段中被刪除的ID（僅在真實模式使用）
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

  /**
   * 切換Mock模式（僅用於開發和測試）
   */
  setMockMode(enabled: boolean): void {
    if (config.isDevelopment) {
      this.useMockData = enabled;
      console.log(`API Service switched to ${enabled ? 'Mock' : 'Real'} mode`);
    }
  }

  /**
   * 獲取當前模式
   */
  getMockMode(): boolean {
    return this.useMockData;
  }
}

// 導出單例實例
export const apiService = new ApiService(); 