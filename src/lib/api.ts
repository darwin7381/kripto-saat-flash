import { config } from './config';
import { Flash, FlashListResponse, SegmentResponse, UpdateCheckResponse, Category, Author, Tag } from '@/types/flash';

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

// STRAPI V5 Flash 直接格式（無 attributes 包裝）
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
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.strapi.apiToken && {
        'Authorization': `Bearer ${config.strapi.apiToken}`,
      }),
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
      'sort': 'id:desc',
      'populate': '*',
    });

    const data = await this.request<StrapiResponse<StrapiFlash[]>>(`/api/flashes?${params}`);
    
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
    const params = new URLSearchParams({
      'filters[categories][slug][$eq]': categorySlug,
      'pagination[page]': page.toString(),
      'pagination[pageSize]': config.api.itemsPerPage.toString(),
      'sort': 'id:desc',
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
    // 基於分類、標籤獲取相關快訊
    const params = new URLSearchParams({
      'filters[id][$ne]': flashId.toString(),
      'pagination[pageSize]': limit.toString(),
      'sort': 'id:desc',
      'populate': 'author,categories,tags,featured_image',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { attributes: StrapiFlashAttributes }>>>(`/api/flashes?${params}`);
    return data.data.map(item => this.transformFlash(item));
  }

  /**
   * 獲取所有分類
   */
  async getCategories(): Promise<Category[]> {
    const params = new URLSearchParams({
      'populate': 'parent_category',
      'sort': 'display_order:asc',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { 
      attributes: {
        name: string;
        slug: string;
        description?: string;
        wp_category_id?: number;
        wp_sync_status?: 'pending' | 'synced' | 'failed';
        display_order?: number;
        is_active?: boolean;
        parent_category?: {
          data?: {
            id: number;
            attributes: {
              name: string;
              slug: string;
            };
          };
        };
      }
    }>>>(`/api/categories?${params}`);
    
    return data.data.map((item) => this.transformCategory(item));
  }

  /**
   * 獲取單個分類
   */
  async getCategory(slug: string): Promise<Category | null> {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate': 'parent_category',
    });

    const data = await this.request<StrapiResponse<Array<StrapiItem & { 
      attributes: {
        name: string;
        slug: string;
        description?: string;
        wp_category_id?: number;
        wp_sync_status?: 'pending' | 'synced' | 'failed';
        display_order?: number;
        is_active?: boolean;
        parent_category?: {
          data?: {
            id: number;
            attributes: {
              name: string;
              slug: string;
            };
          };
        };
      }
    }>>>(`/api/categories?${params}`);
    
    if (data.data.length === 0) {
      return null;
    }

    return this.transformCategory(data.data[0]);
  }

  /**
   * 私有方法：發送HTTP請求
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
   * 轉換StrAPI V5數據格式為內部格式
   */
  private transformFlash(data: StrapiFlash): Flash {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      slug: data.slug,
      published_datetime: data.published_datetime,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      publishedAt: data.publishedAt,
      is_important: data.is_important || false,
      is_featured: data.is_featured || false,
      view_count: data.view_count || 0,
      source_url: data.source_url,
      bullish_count: data.bullish_count || 0,
      bearish_count: data.bearish_count || 0,
      author: this.transformAuthor(data.author),
      categories: data.categories?.map((cat) => this.transformCategory(cat)) || [],
      tags: data.tags?.map((tag) => this.transformTag(tag)) || [],
      featured_image: data.featured_image ? {
        id: data.featured_image.id,
        url: data.featured_image.url,
        alt: data.featured_image.alternativeText || '',
        width: data.featured_image.width || 0,
        height: data.featured_image.height || 0,
        formats: data.featured_image.formats,
      } : undefined,
      meta: {
        views: data.view_count || 0,
        reading_time: Math.ceil(data.content.length / 200),
        source_url: data.source_url,
        bullish_count: data.bullish_count || 0,
        bearish_count: data.bearish_count || 0,
      },
    };
  }

  /**
   * 轉換 STRAPI V5 Author 數據
   */
  private transformAuthor(authorData?: StrapiFlash['author']): Author {
    if (!authorData) {
      return {
        id: 0,
        name: 'Anonymous',
      };
    }

    return {
      id: authorData.id,
      name: authorData.name || 'Anonymous',
      email: authorData.email,
      bio: authorData.bio,
      wp_user_id: authorData.wp_user_id,
      wp_sync_status: authorData.wp_sync_status || 'pending',
      social_links: authorData.social_links,
      avatar: authorData.avatar ? {
        id: authorData.avatar.id,
        url: authorData.avatar.url,
        alt: authorData.avatar.alternativeText || '',
        width: authorData.avatar.width,
        height: authorData.avatar.height,
        formats: authorData.avatar.formats,
      } : undefined,
    };
  }

  /**
   * 轉換 STRAPI V5 Category 數據
   */
  private transformCategory(categoryData: NonNullable<StrapiFlash['categories']>[0]): Category {
    return {
      id: categoryData.id,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      wp_category_id: categoryData.wp_category_id,
      wp_sync_status: categoryData.wp_sync_status || 'pending',
      display_order: categoryData.display_order || 0,
      is_active: categoryData.is_active !== false,
      parent_category: categoryData.parent_category ? {
        id: categoryData.parent_category.id,
        name: categoryData.parent_category.name,
        slug: categoryData.parent_category.slug,
      } : undefined,
    };
  }

  /**
   * 轉換 STRAPI V5 Tag 數據
   */
  private transformTag(tagData: NonNullable<StrapiFlash['tags']>[0]): Tag {
    return {
      id: tagData.id,
      name: tagData.name,
      slug: tagData.slug,
      description: tagData.description,
      wp_tag_id: tagData.wp_tag_id,
      wp_sync_status: tagData.wp_sync_status || 'pending',
      usage_count: tagData.usage_count || 0,
      elasticsearch_synced: tagData.elasticsearch_synced || false,
      color: tagData.color,
      is_active: tagData.is_active !== false,
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