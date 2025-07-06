"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flash } from '@/types/flash';
import { ThumbsUp, ThumbsDown, Share2, ExternalLink } from 'lucide-react';

interface FlashNewsCardProps {
  flash: Flash;
  isImportant?: boolean;
}

export default function FlashNewsCard({ flash, isImportant = false }: FlashNewsCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);

  // 格式化時間 - 只顯示時分
  const formatTime = (dateString: string) => {
    try {
    const date = new Date(dateString);
      // 檢查日期是否有效
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date in FlashNewsCard: ${dateString}`);
        return '--:--'; // 返回默認時間格式
      }
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch (error) {
      console.warn(`Error formatting time: ${dateString}`, error);
      return '--:--'; // 返回默認時間格式
    }
  };

  // 使用 flash.id 生成確定性的市場標籤數據
  const getMarketTags = (id: number) => {
    const tags = [
      { name: "BTC", change: "+1.74%", type: "up" },
      { name: "ETH", change: "-2.12%", type: "down" },
      { name: "USDT", change: "+0.01%", type: "up" },
      { name: "BNB", change: "+3.45%", type: "up" },
      { name: "XRP", change: "-1.23%", type: "down" }
    ];
    
    // 根據 id 選擇 0-3 個標籤
    const tagCount = (id % 4);
    if (tagCount === 0) return [];
    
    const selectedTags = [];
    for (let i = 0; i < tagCount; i++) {
      selectedTags.push(tags[(id + i) % tags.length]);
    }
    return selectedTags;
  };

  // 使用 flash.id 生成確定性的看多看空數據
  const getBullishBearish = (id: number) => {
    const bullish = 20 + (id * 7) % 80;
    const bearish = 15 + (id * 11) % 85;
    return { bullish, bearish };
  };

  // 使用 flash.id 確定是否有查看原文鏈接
  const hasSourceLink = flash.id % 3 !== 0;

  const marketTags = getMarketTags(flash.id);
  const { bullish, bearish } = getBullishBearish(flash.id);

  return (
    <div className="relative group hover:bg-[#fafafa] transition-colors">
      <div className="flex">
        {/* 左側容器 - 包含時間和時間軸 */}
        <div className="flex-shrink-0 w-[100px] relative">
          {/* 時間和圓點在同一行 */}
          <div className="flex items-start pt-3">
            <span className="text-[#333] text-[12px] font-normal leading-[24px] pr-3 text-right w-[70px]" style={{ fontFamily: '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              {formatTime(flash.published_datetime)}
            </span>
            {/* 圓點容器 */}
            <div className="relative w-[30px] flex justify-center">
              {/* 圓點 - 設置 relative 定位和 z-index 確保在時間軸線之上 */}
              <div className="w-[7px] h-[7px] bg-[#dcdcdc] rounded-full mt-[8.5px] relative z-10"></div>
            </div>
          </div>
          {/* 垂直線 - 絕對定位，z-index 默認為 0 */}
          <div className="absolute left-[85px] top-0 bottom-0 w-[1px] bg-[#f2f2f2]"></div>
        </div>

        {/* 內容區域 */}
        <div className="flex-1 pl-3 pr-5 pb-4 pt-3">
          {/* 標題 */}
          <Link 
            href={`/flash/${flash.slug}`}
            prefetch={true}
          >
            <h3 className={`text-[16px] font-medium mb-2 cursor-pointer transition-colors ${
              isImportant 
                ? 'text-[#FF6C47] hover:text-[#ff8866]' 
                : 'text-[#333] hover:text-[#5B7BFF]'
            }`}>
              {flash.title}
            </h3>
          </Link>

          {/* 內容 */}
          <div className="text-[14px] text-[#666] leading-[24px] mb-2">
            {flash.content}
          </div>

          {/* 市場標籤 */}
          {marketTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {marketTags.map((tag, index) => (
                <Link 
                  key={index}
                  href="#"
                  className={`inline-flex items-center px-[5px] rounded text-[12px] transition-all ${
                    tag.type === 'up' 
                      ? 'bg-[#F6FFFC] text-[#00C087] hover:bg-[#e6fff9]' 
                      : 'bg-[#FFF2F2] text-[#FF4949] hover:bg-[#ffe6e6]'
                  }`}
                >
                  <span className="font-medium">{tag.name}</span>
                  <span className="ml-1">{tag.change}</span>
                </Link>
              ))}
            </div>
          )}

          {/* 圖片 */}
          {flash.featured_image && (
            <>
              <div className="mb-2">
                <div 
                  className="w-[300px] h-[160px] rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[#f5f5f5] relative"
                  onClick={() => setShowImageModal(true)}
                >
                  <Image 
                    src={flash.featured_image.url} 
                    alt={flash.featured_image.alt || flash.title}
                    fill
                    className="object-cover"
                    sizes="300px"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* 圖片放大模態框 */}
              {showImageModal && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4"
                  onClick={() => setShowImageModal(false)}
                >
                  <div className="relative max-w-[90vw] max-h-[90vh]">
                    <Image 
                      src={flash.featured_image.url} 
                      alt={flash.featured_image.alt || flash.title}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-[90vh] object-contain"
                      priority
                    />
                    <button 
                      className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                      onClick={() => setShowImageModal(false)}
                      aria-label="關閉圖片"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 操作欄 */}
          <div className="flex items-center gap-4 text-[12px]">
            {/* 消息來源 */}
            {hasSourceLink && (
              <button className="flex items-center gap-1 text-[#999] hover:text-[#5B7BFF] transition-colors">
                <ExternalLink className="w-3 h-3" />
                <span>消息來源</span>
              </button>
            )}

            {/* 看多 */}
            <button className="flex items-center gap-1 text-[#999] hover:text-[#26a69a] transition-colors group/bull">
              <div className="flex items-center justify-center w-4 h-4">
                <ThumbsUp className="w-3.5 h-3.5 group-hover/bull:fill-[#26a69a]" />
              </div>
              <span>看多 {bullish}</span>
            </button>

            {/* 看空 */}
            <button className="flex items-center gap-1 text-[#999] hover:text-[#ef5350] transition-colors group/bear">
              <div className="flex items-center justify-center w-4 h-4">
                <ThumbsDown className="w-3.5 h-3.5 group-hover/bear:fill-[#ef5350]" />
              </div>
              <span>看空 {bearish}</span>
            </button>

            {/* 分享 */}
            <button className="flex items-center gap-1 text-[#999] hover:text-[#5B7BFF] transition-colors ml-auto">
              <Share2 className="w-3.5 h-3.5" />
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 