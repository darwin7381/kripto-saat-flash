'use client';

import React from 'react';
import FlashNewsCard from './FlashNewsCard';
import { Flash } from '@/types/flash';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface FlashListContainerProps {
  flashes: Flash[];
}

// 將日期格式化為標準格式
const formatDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 比較日期（只比較年月日）
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  // 格式化基本日期
  const dateStr = format(date, 'MM月dd日', { locale: zhTW });
  const weekDay = format(date, 'EEEE', { locale: zhTW });
  
  if (isToday) {
    return `今天，${dateStr} ${weekDay}`;
  } else if (isYesterday) {
    return `昨天，${dateStr} ${weekDay}`;
  } else {
    return `${dateStr} ${weekDay}`;
  }
};

// 按日期分組快訊
const groupFlashesByDate = (flashes: Flash[]) => {
  const groups: { [key: string]: { date: Date; flashes: Flash[] } } = {};
  
  flashes.forEach(flash => {
    // 驗證並處理 STRAPI 的 published_datetime 欄位
    let date: Date;
    try {
      date = new Date(flash.published_datetime);
      // 檢查日期是否有效
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date for flash ${flash.id}: ${flash.published_datetime}`);
        date = new Date(); // 使用當前時間作為後備
      }
    } catch (error) {
      console.warn(`Error parsing date for flash ${flash.id}: ${flash.published_datetime}`, error);
      date = new Date(); // 使用當前時間作為後備
    }
    
    const dateKey = date.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date,
        flashes: []
      };
    }
    
    groups[dateKey].flashes.push(flash);
  });
  
  // ✅ 對每個日期分組內部按發布時間降序排列（最新的在前）
  Object.values(groups).forEach(group => {
    group.flashes.sort((a, b) => {
      const timeA = new Date(a.published_datetime).getTime();
      const timeB = new Date(b.published_datetime).getTime();
      return timeB - timeA; // 降序：最新的在前
    });
  });
  
  // 按日期排序（最新的在前）
  return Object.values(groups).sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default function FlashListContainer({ flashes }: FlashListContainerProps) {
  const groupedFlashes = groupFlashesByDate(flashes);
  
  return (
    <div className="flash-list-container bg-white">
      {groupedFlashes.map((group, dateIndex) => (
        <div key={group.date.toISOString()} className="date-section">
          {/* 日期標籤 - 使用 sticky 定位，確保 z-index 低於 Header (z-50) */}
          <div 
            className="sticky bg-[#f9f9f9] border-b border-[#e5e5e5] px-6 py-3"
            style={{ 
              top: '56px',
              zIndex: 40 - dateIndex  // 40, 39, 38... 確保低於 Header 的 z-50
            }}
          >
            <span className="text-[#333] text-sm font-medium">
              {formatDateLabel(group.date)}
            </span>
          </div>
          
          {/* 該日期的所有快訊 */}
          <div className="flash-list">
            {group.flashes.map((flash) => (
              <FlashNewsCard 
                key={flash.id} 
                flash={flash} 
                isImportant={flash.is_important || false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 