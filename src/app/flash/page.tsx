"use client";

import React, { useState, useEffect } from 'react';
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

  // 加載快訊
  const loadFlashes = async (pageNum: number) => {
    setLoading(true);
    try {
      const flashData = await apiService.getHotFlashes(pageNum, config.api.itemsPerPage);
      
      if (pageNum === 1) {
        setFlashes(flashData.flashes);
      } else {
        setFlashes(prev => [...prev, ...flashData.flashes]);
      }
      
      setHasMore(flashData.pagination.hasNext);
    } catch (err) {
      console.error('Error loading flashes:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加載
  useEffect(() => {
    loadFlashes(1);
  }, []);

  // 加載更多
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadFlashes(nextPage);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <Header />
      
      <main className="max-w-[1200px] mx-auto px-4 py-6 flex-1 w-full">
        <div className="flex gap-5">
          {/* Left Column - News */}
          <div className="flex-1 max-w-[820px]">
            {/* News Header */}
            <div className="bg-white rounded-lg px-6 py-4 news-header border-b border-[#e8e8e8]">
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

            {/* 快訊列表 */}
            <div className="bg-white rounded-lg mt-[-1px]">
              {loading && flashes.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-[#666]">加載中...</p>
                </div>
              ) : (
                <FlashListContainer flashes={flashes} />
              )}
            </div>
            
            {/* 加載更多按鈕 - 獨立的白底容器 */}
            {hasMore && flashes.length > 0 && (
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
            {!hasMore && flashes.length > 0 && (
              <div className="bg-white rounded-lg mt-4 py-4 text-center">
                <p className="text-[#999] text-sm">已加載全部快訊</p>
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