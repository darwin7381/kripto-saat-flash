export interface Flash {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  published_datetime: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  featured_image?: {
    id?: number;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    formats?: Record<string, unknown>;
  };
  is_important?: boolean;
  is_featured?: boolean;
  view_count?: number;
  source_url?: string;
  bullish_count?: number;
  bearish_count?: number;
  meta?: {
    views?: number;
    reading_time?: number;
    source_url?: string;
    bullish_count?: number;
    bearish_count?: number;
  };
  isImportant?: boolean;
}

export interface Author {
  id: number;
  name: string;
  email?: string;
  bio?: string;
  avatar?: {
    id?: number;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    formats?: Record<string, unknown>;
  };
  wp_user_id?: number;
  wp_sync_status?: 'pending' | 'synced' | 'failed';
  social_links?: Record<string, string>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  wp_category_id?: number;
  wp_sync_status?: 'pending' | 'synced' | 'failed';
  display_order?: number;
  is_active?: boolean;
  parent_category?: Category;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  wp_tag_id?: number;
  wp_sync_status?: 'pending' | 'synced' | 'failed';
  usage_count?: number;
  elasticsearch_synced?: boolean;
  color?: string;
  is_active?: boolean;
}

export interface FlashListResponse {
  flashes: Flash[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    isLastHotPage?: boolean;
    nextSegmentId?: number;
    totalSegments?: number;
  };
}

export interface SegmentResponse {
  segmentId: number;
  flashes: Flash[];
  previousSegmentId?: number;
  nextSegmentId?: number;
  isLastSegment: boolean;
  totalSegments: number;
  activeCount: number;
  deletedIds?: number[];
}

export interface UpdateCheckResponse {
  newCount: number;
  latestId: number;
  hasUpdates: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
} 

// Strapi V5 標準響應格式
export interface StrapiResponse<T> {
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