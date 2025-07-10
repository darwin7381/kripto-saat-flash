'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Flash } from '@/types/flash';
import ResponsiveTimelineCard from './ResponsiveTimelineCard';
import ToggleSwitch from '@/components/ui/toggle-switch';
import { useImportantFilter } from './ImportantFilterContext';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface ResponsiveTimelineContainerProps {
  flashes: Flash[];
  skipFirstDateHeader?: boolean;
  isFirstContainer?: boolean; // 標識這是否是第一個容器（不是加載更多的）
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
  skipFirstDateHeader = false,
  isFirstContainer = false 
}: ResponsiveTimelineContainerProps) {
  const { showImportantOnly, setShowImportantOnly } = useImportantFilter();
  const [stickyDateIndex, setStickyDateIndex] = useState(-1); // 追蹤當前置頂的日期標索引，-1表示沒有置頂
  const dateHeaderRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // 根據開關狀態篩選快訊
  const filteredFlashes = showImportantOnly 
    ? flashes.filter(flash => flash.is_important || flash.isImportant)
    : flashes;
  
  const groupedFlashes = groupFlashesByDate(filteredFlashes);
  
  // 檢測置頂狀態的滾動監聽器
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 56; // Header 高度
      
      // 遍歷所有日期標，找出當前置頂的
      for (let i = 0; i < dateHeaderRefs.current.length; i++) {
        const header = dateHeaderRefs.current[i];
        if (header) {
          const rect = header.getBoundingClientRect();
          // 如果日期標在置頂位置（考慮 header 高度）
          if (rect.top <= headerHeight && rect.bottom > headerHeight) {
            setStickyDateIndex(i);
            break;
          }
        }
      }
    };
    
    // 添加滾動監聽器
    window.addEventListener('scroll', handleScroll);
    // 初始化檢測
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [groupedFlashes.length]);
  
  return (
    <div className="responsive-timeline-container bg-white">
      {groupedFlashes.map((group, dateIndex) => (
        <div key={group.date.toISOString()} className="date-section">
          {/* 日期標籤 - 條件性渲染：如果是第一個且設置了跳過，則不渲染 */}
          {!(skipFirstDateHeader && dateIndex === 0) && (
            <div 
              ref={(el) => {
                dateHeaderRefs.current[dateIndex] = el;
              }}
              className="sticky bg-[#f9f9f9] border-b border-[#e5e5e5] px-3 md:px-6 py-3"
              style={{ 
                top: '56px',
                zIndex: 40 - dateIndex  // 40, 39, 38... 確保低於 Header 的 z-50
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#333] text-sm font-medium">
                  {formatDateLabel(group.date)}
                </span>
                {/* 只有第一個容器的第一個日期標籤永遠顯示開關，或者當前置頂的日期標籤顯示開關 */}
                {((isFirstContainer && dateIndex === 0) || dateIndex === stickyDateIndex) && (
                  <ToggleSwitch
                    label="只看重要"
                    checked={showImportantOnly}
                    onChange={setShowImportantOnly}
                  />
                )}
              </div>
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