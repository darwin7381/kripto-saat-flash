'use client';

import { useState, useEffect, useCallback } from 'react';
import { FlashCard } from './FlashCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Flash, FlashListResponse } from '@/types/flash';
import { config } from '@/lib/config';

interface FlashListContainerProps {
  initialData: FlashListResponse;
}

export function FlashListContainer({ initialData }: FlashListContainerProps) {
  const [flashes, setFlashes] = useState<Flash[]>(initialData.flashes);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSegment, setCurrentSegment] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInSegmentMode, setIsInSegmentMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFlashId, setLastFlashId] = useState<number>(0);

  // 初始化最新快訊ID（用於更新檢查）
  useEffect(() => {
    if (initialData.flashes.length > 0) {
      setLastFlashId(Math.max(...initialData.flashes.map(f => f.id)));
    }
  }, [initialData.flashes]);

  // 載入更多快訊
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!isInSegmentMode && currentPage < config.api.hotPagesLimit) {
        // 系統一：載入熱門頁面
        const nextPage = currentPage + 1;
        const response = await fetch(`/api/flashes/top?page=${nextPage}&limit=${config.api.itemsPerPage}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to load flashes');
        }

        setFlashes(prev => [...prev, ...data.data.flashes]);
        setCurrentPage(nextPage);

        // 檢查是否到達熱門頁面末尾
        if (data.data.meta?.isLastHotPage) {
          setIsInSegmentMode(true);
          setCurrentSegment(data.data.meta.nextSegmentId);
        }

        setHasMore(data.data.pagination.hasNext || data.data.meta?.isLastHotPage);
      } else if (isInSegmentMode && currentSegment) {
        // 系統二：載入歷史區段
        const response = await fetch(`/api/flashes/segment/${currentSegment}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to load segment');
        }

        setFlashes(prev => [...prev, ...data.data.flashes]);
        setCurrentSegment(data.data.nextSegmentId);
        setHasMore(!data.data.isLastSegment);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入失敗');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, isInSegmentMode, currentPage, currentSegment]);

  // 檢查新快訊更新
  const checkForUpdates = useCallback(async () => {
    try {
      const response = await fetch(`/api/flashes/check-updates?lastId=${lastFlashId}`);
      const data = await response.json();

      if (data.success && data.data.hasUpdates) {
        // 顯示更新提示（這裡可以加入Toast組件）
        console.log(`發現 ${data.data.newCount} 條新快訊`);
      }
    } catch (err) {
      console.error('檢查更新失敗:', err);
    }
  }, [lastFlashId]);

  // 設置定期檢查更新
  useEffect(() => {
    const interval = setInterval(checkForUpdates, config.api.updateCheckInterval);
    return () => clearInterval(interval);
  }, [checkForUpdates]);

  // 無限滾動監聽
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div className="space-y-6">
      {/* 快訊網格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashes.map((flash, index) => (
          <FlashCard 
            key={flash.id} 
            flash={flash} 
            priority={index < 6} // 前6個優先載入
          />
        ))}
      </div>

      {/* 載入狀態 */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 錯誤狀態 */}
      {error && (
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              loadMore();
            }}
            variant="outline"
          >
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* 載入更多按鈕 */}
      {!isLoading && hasMore && !error && (
        <div className="text-center py-8">
          <Button 
            onClick={loadMore}
            size="lg"
            className="px-8"
          >
            Daha Fazla Haber Yükle
          </Button>
        </div>
      )}

      {/* 結束提示 */}
      {!hasMore && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Tüm haberler yüklendi
          </p>
        </div>
      )}

      {/* 系統狀態指示器（開發時可見） */}
      {config.isDevelopment && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg p-3 text-xs space-y-1 shadow-lg">
          <div>模式: {isInSegmentMode ? '歷史區段' : '熱門頁面'}</div>
          <div>當前頁: {currentPage}</div>
          {isInSegmentMode && <div>區段: {currentSegment}</div>}
          <div>已載入: {flashes.length}</div>
          <div>最新ID: {lastFlashId}</div>
        </div>
      )}
    </div>
  );
} 