export interface Flash {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  categories: Category[];
  tags: Tag[];
  featured_image?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  meta: {
    views?: number;
    reading_time?: number;
  };
  isImportant?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  wp_category_id?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  wp_tag_id?: number;
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