import { Flash, FlashListResponse, SegmentResponse, UpdateCheckResponse, Category } from '@/types/flash';
import { mockFlashes } from './flashes';
import { mockCategories } from './categories';
import { config } from '@/lib/config';

export class MockApiService {
  /**
   * 模擬系統一：熱門頁面API
   */
  async getHotFlashes(page: number = 1, limit: number = config.api.itemsPerPage): Promise<FlashListResponse> {
    // 模擬網路延遲
    await this.delay(200 + Math.random() * 300);

    if (page > config.api.hotPagesLimit) {
      throw new Error(`Page ${page} exceeds hot pages limit (${config.api.hotPagesLimit})`);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const flashes = mockFlashes.slice(startIndex, endIndex);

    const totalFlashes = mockFlashes.length;
    const totalPages = Math.ceil(totalFlashes / limit);
    const hotPagesTotal = config.api.hotPagesLimit * limit;

    const response: FlashListResponse = {
      flashes,
      pagination: {
        page,
        limit,
        total: Math.min(totalFlashes, hotPagesTotal),
        totalPages: Math.min(totalPages, config.api.hotPagesLimit),
        hasNext: page < Math.min(totalPages, config.api.hotPagesLimit),
        hasPrev: page > 1,
      },
    };

    // 如果是最後一頁熱門內容，提供切換信息
    if (page === config.api.hotPagesLimit || page === Math.min(totalPages, config.api.hotPagesLimit)) {
      const latestHotPages = config.api.hotPagesLimit * limit;
      const historicalFlashes = totalFlashes - latestHotPages;
      const totalSegments = Math.ceil(historicalFlashes / config.api.segmentSize);
      
      response.meta = {
        isLastHotPage: true,
        nextSegmentId: totalSegments, // 從最新的歷史區段開始
        totalSegments,
      };
    }

    return response;
  }

  /**
   * 模擬系統二：歷史區段API
   */
  async getSegmentFlashes(segmentId: number): Promise<SegmentResponse> {
    // 模擬網路延遲
    await this.delay(150 + Math.random() * 200);

    const totalFlashes = mockFlashes.length;
    const latestHotPages = config.api.hotPagesLimit * config.api.itemsPerPage;
    const historicalFlashes = totalFlashes - latestHotPages;
    const totalSegments = Math.ceil(historicalFlashes / config.api.segmentSize);

    if (segmentId < 1 || segmentId > totalSegments) {
      throw new Error('Segment not found');
    }

    // 計算區段在歷史數據中的位置（反向：segmentId越大越舊）
    const historicalStartIndex = latestHotPages + (totalSegments - segmentId) * config.api.segmentSize;
    const historicalEndIndex = historicalStartIndex + config.api.segmentSize;
    
    const flashes = mockFlashes.slice(historicalStartIndex, historicalEndIndex);

    return {
      segmentId,
      flashes,
      previousSegmentId: segmentId < totalSegments ? segmentId + 1 : undefined,
      nextSegmentId: segmentId > 1 ? segmentId - 1 : undefined,
      isLastSegment: segmentId === 1,
      totalSegments,
      activeCount: flashes.length,
      deletedIds: [], // 假資料中沒有刪除的文章
    };
  }

  /**
   * 模擬檢查更新API
   */
  async checkUpdates(lastId: number): Promise<UpdateCheckResponse> {
    // 模擬網路延遲
    await this.delay(100 + Math.random() * 100);

    const newerFlashes = mockFlashes.filter(flash => flash.id > lastId);
    const latestFlash = mockFlashes[0]; // 最新的快訊

    return {
      newCount: newerFlashes.length,
      latestId: latestFlash ? latestFlash.id : lastId,
      hasUpdates: newerFlashes.length > 0,
    };
  }

  /**
   * 模擬獲取單篇快訊
   */
  async getFlash(slug: string): Promise<Flash | null> {
    // 模擬網路延遲
    await this.delay(100 + Math.random() * 200);

    const flash = mockFlashes.find(f => f.slug === slug);
    return flash || null;
  }

  /**
   * 模擬獲取分類快訊
   */
  async getCategoryFlashes(categorySlug: string, page: number = 1): Promise<FlashListResponse> {
    // 模擬網路延遲
    await this.delay(200 + Math.random() * 300);

    const category = mockCategories.find(c => c.slug === categorySlug);
    if (!category) {
      throw new Error('Category not found');
    }

    const categoryFlashes = mockFlashes.filter(flash => 
      flash.categories.some(cat => cat.slug === categorySlug)
    );

    const limit = config.api.itemsPerPage;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const flashes = categoryFlashes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(categoryFlashes.length / limit);

    return {
      flashes,
      pagination: {
        page,
        limit,
        total: categoryFlashes.length,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 模擬獲取相關快訊
   */
  async getRelatedFlashes(flashId: number, limit: number = 5): Promise<Flash[]> {
    // 模擬網路延遲
    await this.delay(100 + Math.random() * 150);

    const currentFlash = mockFlashes.find(f => f.id === flashId);
    if (!currentFlash) {
      return [];
    }

    // 基於分類和標籤找相關快訊
    const relatedFlashes = mockFlashes
      .filter(flash => flash.id !== flashId)
      .filter(flash => {
        // 有相同分類或標籤
        const hasSameCategory = flash.categories.some(cat => 
          currentFlash.categories.some(currentCat => currentCat.id === cat.id)
        );
        const hasSameTag = flash.tags.some(tag => 
          currentFlash.tags.some(currentTag => currentTag.id === tag.id)
        );
        return hasSameCategory || hasSameTag;
      })
      .slice(0, limit);

    return relatedFlashes;
  }

  /**
   * 模擬獲取所有分類
   */
  async getCategories(): Promise<Category[]> {
    // 模擬網路延遲
    await this.delay(100 + Math.random() * 100);

    return mockCategories;
  }

  /**
   * 模擬獲取單個分類
   */
  async getCategory(slug: string): Promise<Category | null> {
    // 模擬網路延遲
    await this.delay(100 + Math.random() * 100);

    const category = mockCategories.find(c => c.slug === slug);
    return category || null;
  }

  /**
   * 模擬網路延遲
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 模擬隨機錯誤（用於測試錯誤處理）
   */
  private shouldSimulateError(): boolean {
    // 5% 機率模擬錯誤（僅在開發環境）
    return config.isDevelopment && Math.random() < 0.05;
  }
}

// 導出單例實例
export const mockApiService = new MockApiService(); 