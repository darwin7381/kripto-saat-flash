"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flash } from '@/types/flash';
import { ThumbsUp, ThumbsDown, Share2, ExternalLink } from 'lucide-react';

interface CompactTimelineCardProps {
  flash: Flash;
  isImportant?: boolean;
}

export default function CompactTimelineCard({ flash, isImportant = false }: CompactTimelineCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);

  // 格式化日期和時間 - 日期在前，時間在後，非今年顯示年份
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // 檢查日期是否有效
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date in CompactTimelineCard: ${dateString}`);
        return '--/-- --:--'; // 返回默認格式
      }
      
      const currentYear = new Date().getFullYear();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const time = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      // 如果是今年，只顯示月日；如果非今年，顯示年月日
      if (year === currentYear) {
        return `${month}/${day} ${time}`;
      } else {
        return `${year}/${month}/${day} ${time}`;
      }
    } catch (error) {
      console.warn(`Error formatting datetime: ${dateString}`, error);
      return '--/-- --:--'; // 返回默認格式
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
    <div className="relative group hover:bg-[#fafafa] transition-colors py-4">
      {/* 垂直線 */}
      <div className="absolute left-[10px] top-0 bottom-0 w-[1px] bg-[#e8e8e8]"></div>
      
      {/* 圓點 */}
      <div className="absolute left-[7px] top-[20px] w-[7px] h-[7px] bg-[#dcdcdc] rounded-full z-10"></div>
      
      {/* 內容 */}
      <div className="pl-[30px] pr-2">
        {/* 日期時間 - 第一行 */}
        <div className="text-[12px] text-[#999] mb-1">
          {formatDateTime(flash.published_datetime)}
        </div>
        
        {/* 標題 - 第二行，與時間對齊 */}
        <Link href={`/flash/${flash.slug}`}>
          <h4 className={`text-[16px] font-normal leading-[1.5] mb-2 transition-colors ${
            isImportant 
              ? 'text-[#FF6C47] hover:text-[#ff8866]' 
              : 'text-[#333] hover:text-[#5B7BFF]'
          }`}>
            {flash.title}
          </h4>
        </Link>
        
        {/* 摘要 */}
        <p className="text-[14px] text-[#999] leading-[1.6] mb-2">
          {flash.excerpt || flash.content.slice(0, 100)}
          {(flash.excerpt || flash.content).length > 100 && '...'}
        </p>

        {/* 圖片 - 在標籤之前 */}
        {flash.featured_image && (
          <div className="mb-2">
            <div 
              className="w-[250px] h-[130px] rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[#f5f5f5] relative"
              onClick={() => setShowImageModal(true)}
            >
              <Image 
                src={flash.featured_image.url} 
                alt={flash.featured_image.alt || flash.title}
                fill
                className="object-cover"
                sizes="250px"
                loading="lazy"
              />
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
          </div>
        )}

        {/* 市場標籤 - 在圖片之後，操作欄之前 */}
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

        {/* 操作欄 - 在最後 */}
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
  );
} 