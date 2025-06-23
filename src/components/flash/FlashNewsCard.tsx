"use client";

import React from 'react';
import Link from 'next/link';
import { Flash } from '@/types/flash';
import { ThumbsUp, ThumbsDown, Share2, ExternalLink } from 'lucide-react';

interface FlashNewsCardProps {
  flash: Flash;
  isImportant?: boolean;
}

export default function FlashNewsCard({ flash, isImportant = false }: FlashNewsCardProps) {
  // 格式化時間 - 只顯示時分
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // 模擬市場標籤數據
  const marketTags = [
    { name: "BTC", change: "+1.74%", type: "up" },
    { name: "ETH", change: "-2.12%", type: "down" }
  ];

  // 模擬看多看空數據
  const bullish = Math.floor(Math.random() * 100) + 1;
  const bearish = Math.floor(Math.random() * 100) + 1;

  // 判斷是否有查看原文鏈接
  const hasSourceLink = Math.random() > 0.5;

  return (
    <div className="relative group hover:bg-[#fafafa] transition-colors">
      <div className="flex">
        {/* 左側容器 - 包含時間和時間軸 */}
        <div className="flex-shrink-0 w-[100px] relative">
          {/* 時間和圓點在同一行 */}
          <div className="flex items-start pt-3">
            <span className="text-[#333] text-[12px] font-normal leading-[24px] pr-3 text-right w-[70px]" style={{ fontFamily: '"PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              {formatTime(flash.published_at)}
            </span>
            {/* 圓點容器 */}
            <div className="relative w-[30px] flex justify-center">
              {/* 圓點 - 添加 z-10 確保在垂直線上方 */}
              <div className="w-[7px] h-[7px] bg-[#dcdcdc] rounded-full mt-[8.5px] z-10 relative"></div>
            </div>
          </div>
          {/* 垂直線 - 絕對定位 */}
          <div className="absolute left-[85px] top-0 bottom-0 w-[1px] bg-[#f2f2f2]"></div>
        </div>

        {/* 內容區域 */}
        <div className="flex-1 pl-3 pr-5 pb-4 pt-3">
          {/* 標題 */}
          <Link href={`/flash/${flash.slug}`}>
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
            <div className="mb-2">
              <img 
                src={flash.featured_image.url} 
                alt={flash.featured_image.alt || flash.title}
                className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          )}

          {/* 操作欄 */}
          <div className="flex items-center gap-4 text-[12px]">
            {/* 查看原文 */}
            {hasSourceLink && (
              <button className="flex items-center gap-1 text-[#999] hover:text-[#5B7BFF] transition-colors">
                <ExternalLink className="w-3 h-3" />
                <span>查看原文</span>
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