'use client';

import React from 'react';
import { Flash } from '@/types/flash';
import CompactTimelineCard from './CompactTimelineCard';

interface CompactTimelineContainerProps {
  flashes: Flash[];
}

export default function CompactTimelineContainer({ flashes }: CompactTimelineContainerProps) {
  // 按發布時間排序（最新的在前）
  const sortedFlashes = [...flashes].sort((a, b) => {
    const timeA = new Date(a.published_datetime).getTime();
    const timeB = new Date(b.published_datetime).getTime();
    return timeB - timeA; // 降序：最新的在前
  });

  return (
    <div className="compact-timeline-container bg-white">
      {/* 中間值間距：桌面版 px-6，手機版 px-3 與響應式版本保持一致 */}
      <div className="px-3 md:px-6">
        {sortedFlashes.map((flash) => (
          <CompactTimelineCard 
            key={flash.id} 
            flash={flash} 
            isImportant={flash.is_important || false}
          />
        ))}
      </div>
    </div>
  );
} 