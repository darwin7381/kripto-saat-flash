'use client';

import React from 'react';
import { Flash } from '@/types/flash';
import ResponsiveTimelineCard from './ResponsiveTimelineCard';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ResponsiveTimelineContainerProps {
  flashes: Flash[];
  skipFirstDateHeader?: boolean;
}

// 將日期格式化為標準格式
const formatDateLabel = (date: Date): string => {
  const today = new Date();
  
  // 計算日期差異（只比較年月日）
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const timeDiff = todayDate.getTime() - targetDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // 格式化基本日期
  const dateStr = format(date, 'MM月dd日', { locale: zhTW });
  const weekDay = format(date, 'EEEE', { locale: zhTW });
  
  // 根據日期差異顯示不同的前綴
  if (daysDiff === 0) {
    return `今天 | ${dateStr} ${weekDay}`;
  } else if (daysDiff === 1) {
    return `昨天 | ${dateStr} ${weekDay}`;
  } else if (daysDiff === 2) {
    return `1 天前 | ${dateStr} ${weekDay}`;
  } else if (daysDiff === 3) {
    return `2 天前 | ${dateStr} ${weekDay}`;
  } else if (daysDiff === 4) {
    return `3 天前 | ${dateStr} ${weekDay}`;
  } else {
    // 超過 3 天前就不加前綴
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
  
  // 對每個日期分組內部按發布時間降序排列（最新的在前）
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

export default function ResponsiveTimelineContainer({ 
  flashes, 
  skipFirstDateHeader = false 
}: ResponsiveTimelineContainerProps) {
  const groupedFlashes = groupFlashesByDate(flashes);
  
  return (
    <div className="responsive-timeline-container bg-white">
      {groupedFlashes.map((group, dateIndex) => (
        <div key={group.date.toISOString()} className="date-section">
          {/* 日期標籤 - 條件性渲染：如果是第一個且設置了跳過，則不渲染 */}
          {!(skipFirstDateHeader && dateIndex === 0) && (
            <div 
              className="sticky bg-[#f9f9f9] border-b border-[#e5e5e5] px-3 md:px-6 py-3"
              style={{ 
                top: '56px',
                zIndex: 40 - dateIndex  // 40, 39, 38... 確保低於 Header 的 z-50
              }}
            >
              <span className="text-[#333] text-sm font-medium">
                {formatDateLabel(group.date)}
              </span>
            </div>
          )}
          
          {/* 該日期的所有快訊 */}
          <div className="timeline-list">
            {/* 中間值間距：桌面版 px-6，手機版 px-3 */}
            <div className="px-3 md:px-6">
              {group.flashes.map((flash) => (
                <ResponsiveTimelineCard 
                  key={flash.id} 
                  flash={flash} 
                  isImportant={flash.is_important || false}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 