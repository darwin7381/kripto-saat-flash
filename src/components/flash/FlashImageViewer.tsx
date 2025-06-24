"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface FlashImageViewerProps {
  src: string;
  alt: string;
}

export default function FlashImageViewer({ src, alt }: FlashImageViewerProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="inline-block">
        <div 
          className="w-[300px] h-[160px] rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-[#f5f5f5] relative"
          onClick={() => setShowModal(true)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="300px"
            priority
          />
        </div>
      </div>

      {/* 圖片放大模態框 */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image 
              src={src} 
              alt={alt}
              width={1200}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
              priority
            />
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setShowModal(false)}
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
  );
} 