"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '@/lib/api';
import { config } from '@/lib/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FlashListContainer from '@/components/flash/FlashListContainer';
import MarketSidebar from '@/components/market/MarketSidebar';
import FloatingButtons from '@/components/ui/FloatingButtons';
import { Flash } from '@/types/flash';

export default function FlashPage() {
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  // 加載更多快訊
  const loadMoreFlashes = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const flashData = await apiService.getHotFlashes(page, config.api.itemsPerPage);
      
      if (flashData.flashes.length === 0) {
        setHasMore(false);
      } else {
        setFlashes(prev => [...prev, ...flashData.flashes]);
        setPage(prev => prev + 1);
        setHasMore(flashData.pagination.hasNext);
      }
    } catch (err) {
      setError('載入快訊時發生錯誤');
      console.error('Error loading flashes:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore]);

  // 初始加載
  useEffect(() => {
    loadMoreFlashes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 無限滾動監聽
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000) {
        loadMoreFlashes();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreFlashes]);

  if (error && flashes.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Header />
        
        <main className="max-w-[1200px] mx-auto px-4 py-8 flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#333] mb-4">
              发生错误
            </h1>
            <p className="text-[#666] mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#5B7BFF] text-white px-4 py-2 rounded-md hover:bg-[#4a6ae6] transition-colors"
            >
              重新载入
            </button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-6 flex-1 w-full">
        <div className="flex gap-5">
          {/* Left Column - News */}
          <div className="flex-1 max-w-[820px]">
            {/* News Header */}
            <div className="bg-white rounded-t-lg border-b border-[#e8e8e8] px-6 py-4 news-header">
              <div className="flex items-center justify-between">
                <h1 className="text-[18px] font-normal text-[#333]">币世界快讯</h1>
                <div className="flex items-center border border-[#ddd] rounded px-3 py-1.5">
                  <input 
                    type="text" 
                    placeholder="输入关键字" 
                    className="text-sm outline-none bg-transparent w-32 placeholder-[#999]"
                  />
                  <svg className="w-4 h-4 text-[#999] ml-2 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 快訊列表容器 */}
            <div className="bg-white">
              {loading && flashes.length === 0 ? (
                <div className="py-8 text-center">
                  <p>加載中...</p>
                </div>
              ) : (
                <FlashListContainer flashes={flashes} />
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white px-6 py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B7BFF]"></div>
                <p className="text-[#666] mt-2">加载中...</p>
              </div>
            )}

            {/* No More Content */}
            {!hasMore && flashes.length > 0 && (
              <div className="bg-white px-6 py-8 text-center border-t border-[#e8e8e8]">
                <p className="text-[#999] text-sm">已加载全部快讯</p>
              </div>
            )}

            {/* Error State */}
            {error && flashes.length > 0 && (
              <div className="bg-white px-6 py-4 text-center border-t border-[#e8e8e8]">
                <p className="text-red-500 text-sm">{error}</p>
                <button 
                  onClick={loadMoreFlashes}
                  className="mt-2 text-[#5B7BFF] hover:text-[#4a6ae6] text-sm"
                >
                  重试
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-[340px] hidden lg:block">
            <MarketSidebar />
          </div>
        </div>
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
} 