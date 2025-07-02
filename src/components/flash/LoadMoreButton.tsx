"use client";

import React, { useState } from 'react';
import { config } from '@/lib/config';
import { apiService } from '@/lib/api';
import { Flash } from '@/types/flash';
import FlashListContainer from './FlashListContainer';

interface LoadMoreButtonProps {
  initialHasMore: boolean;
}

export default function LoadMoreButton({ initialHasMore }: LoadMoreButtonProps) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [newFlashes, setNewFlashes] = useState<Flash[]>([]);

  // 加載更多快訊
  const handleLoadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    
    console.log(`LoadMoreButton: Attempting to load page ${nextPage}`);
    
    try {
      // ✅ 統一使用 apiService (fetch-ponyfill)，與 SSR 格式一致
      console.log(`LoadMoreButton: Fetching via apiService, page ${nextPage}`);
      
      const flashData = await apiService.getHotFlashes(nextPage, config.api.itemsPerPage);
      
      console.log(`LoadMoreButton: API response:`, {
        flashesCount: flashData.flashes.length,
        hasNext: flashData.pagination.hasNext,
        page: flashData.pagination.page
      });
      
      const loadedFlashes = flashData.flashes;
      
      if (loadedFlashes && Array.isArray(loadedFlashes)) {
        console.log(`LoadMoreButton: Adding ${loadedFlashes.length} new flashes`);
        setNewFlashes(prev => [...prev, ...loadedFlashes]);
        setHasMore(flashData.pagination.hasNext);
        setPage(nextPage);
      } else {
        console.error(`LoadMoreButton: Invalid flashes data:`, loadedFlashes);
        throw new Error('Invalid flashes data structure');
      }
    } catch (err) {
      console.error('LoadMoreButton: Error loading more flashes:', err);
      // 顯示用戶友好的錯誤信息
      alert(`載入失敗：${err instanceof Error ? err.message : '未知錯誤'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 動態加載的快訊 */}
      {newFlashes.length > 0 && (
        <div className="bg-white rounded-lg mt-[-1px]">
          <FlashListContainer flashes={newFlashes} />
        </div>
      )}

      {/* 加載更多按鈕 */}
      {hasMore && (
        <div className="bg-white rounded-lg mt-4">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full py-4 flex items-center justify-center gap-2 text-[#5B7BFF] hover:text-[#8da1ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {/* 雙箭頭向下圖標 */}
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
              {loading ? '加載中...' : '加載更多'}
            </span>
          </button>
        </div>
      )}
      
      {/* 已加載全部 */}
      {!hasMore && (
        <div className="bg-white rounded-lg mt-4 py-4 text-center">
          <p className="text-[#999] text-sm">已加載全部快訊</p>
        </div>
      )}
    </>
  );
} 