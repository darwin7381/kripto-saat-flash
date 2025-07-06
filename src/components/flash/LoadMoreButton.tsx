"use client";

import React, { useState } from 'react';
import { apiService } from '@/lib/api';
import { Flash } from '@/types/flash';
import FlashListContainer from './FlashListContainer';

interface LoadMoreButtonProps {
  initialHasMore: boolean;
  lastFlashDate?: string; // SSR內容中最後一篇快訊的發布日期
}

// 將日期字符串轉換為日期字符串（只比較年月日）
const getDateString = (dateStr: string): string => {
  return new Date(dateStr).toDateString();
};

export default function LoadMoreButton({ initialHasMore, lastFlashDate }: LoadMoreButtonProps) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [newFlashes, setNewFlashes] = useState<Flash[]>([]);

  const handleLoadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    
    try {
      const result = await apiService.getHotFlashes(nextPage, 25);
      
      if (result.flashes && result.flashes.length > 0) {
        setNewFlashes(prev => [...prev, ...result.flashes]);
        setPage(nextPage);
        setHasMore(result.pagination.hasNext);
      } else {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('LoadMore錯誤:', error);
      alert(`載入失敗：${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setLoading(false);
    }
  };

  // 檢查是否需要跳過第一個日期標題
  const shouldSkipFirstDateHeader = (): boolean => {
    if (!lastFlashDate || newFlashes.length === 0) {
      return false;
    }
    
    // 獲取SSR內容最後日期和LoadMore內容第一個日期
    const lastSSRDate = getDateString(lastFlashDate);
    const firstNewDate = getDateString(newFlashes[0].published_datetime);
    
    // 如果日期相同，跳過第一個日期標題
    return lastSSRDate === firstNewDate;
  };

  return (
    <>
      {/* 動態載入的快訊 */}
      {newFlashes.length > 0 && (
        <div className="bg-white rounded-lg mt-[-1px]">
          <FlashListContainer 
            flashes={newFlashes} 
            skipFirstDateHeader={shouldSkipFirstDateHeader()}
          />
        </div>
      )}

      {/* LoadMore按鈕 */}
      {hasMore && (
        <div className="bg-white rounded-lg mt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full py-4 flex items-center justify-center gap-2 text-[#5B7BFF] hover:text-[#8da1ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            <svg 
              className="w-5 h-5 group-hover:text-[#8da1ff] transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7" 
              />
            </svg>
            <span className="text-[14px] font-normal group-hover:text-[#8da1ff] transition-colors">
              {loading ? '載入中...' : '載入更多'}
            </span>
          </button>
        </div>
      )}
      
      {!hasMore && (
        <div className="bg-white rounded-lg mt-4 py-4 text-center">
          <p className="text-[#999] text-sm">已載入全部快訊</p>
        </div>
      )}
    </>
  );
} 