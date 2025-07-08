'use client';

import React from 'react';
import { Flash } from '@/types/flash';
import EmbedTimelineCard from './EmbedTimelineCard';

interface EmbedTimelineContainerProps {
  flashes: Flash[];
}

export default function EmbedTimelineContainer({ flashes }: EmbedTimelineContainerProps) {
  // 按發布時間排序（最新的在前）
  const sortedFlashes = [...flashes].sort((a, b) => {
    const timeA = new Date(a.published_datetime).getTime();
    const timeB = new Date(b.published_datetime).getTime();
    return timeB - timeA; // 降序：最新的在前
  });

  return (
    <div className="embed-timeline-container bg-white">
      {/* 中間值間距：桌面版 px-6，手機版 px-3 */}
      <div className="px-3 md:px-6">
        {sortedFlashes.map((flash) => (
          <EmbedTimelineCard 
            key={flash.id} 
            flash={flash} 
            isImportant={flash.is_important || false}
          />
        ))}
      </div>
    </div>
  );
} 