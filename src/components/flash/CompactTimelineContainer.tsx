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
      {/* 響應式間距：桌面版 px-6，手機版 px-2 */}
      <div className="px-2 md:px-6">
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