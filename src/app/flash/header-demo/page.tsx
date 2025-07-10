"use client";

import React, { useState, useEffect } from 'react';
import HeaderNew from '@/components/layout/Header-New';

export default function HeaderDemo() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 通過 Playwright 精確復刻的 Header 組件 */}
      <HeaderNew />
      
      {/* 滾動位置指示器 */}
      <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="text-sm font-medium">滾動位置: {scrollY}px</div>
        <div className="text-xs">
          {scrollY > 150 ? '✅ Sticky Header 顯示' : '❌ Sticky Header 隱藏'}
        </div>
      </div>
      
      {/* 演示內容 */}
      <main className="max-w-[1200px] mx-auto px-[15px] py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🎯 真正精確的 kriptosaat.com Header 復刻
          </h1>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-3">
                ✅ 通過 Playwright 獲得的精確樣式
              </h2>
              <p className="text-green-700 mb-4">
                使用 Playwright 工具獲取了真實網站的計算樣式，確保每個細節都完全一致：
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><strong>✓ topbar 背景顏色：</strong> rgb(33, 33, 33)</div>
                  <div><strong>✓ topbar 高度：</strong> 34px</div>
                  <div><strong>✓ 搜索框邊框：</strong> rgb(224, 224, 224)</div>
                  <div><strong>✓ 搜索框圓角：</strong> 33px</div>
                </div>
                <div className="space-y-2">
                  <div><strong>✓ 導航鏈接字體：</strong> 15px，粗體 700</div>
                  <div><strong>✓ bottombar 高度：</strong> 50px</div>
                  <div><strong>✓ 字體系列：</strong> Helvetica Neue</div>
                  <div><strong>✓ Hover 效果：</strong> 紅色過渡</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">🎨 精確樣式復刻</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>✓ 真實 Logo 圖片連結</li>
                  <li>✓ 精確的顏色值 (rgb)</li>
                  <li>✓ 正確的字體粗細和大小</li>
                  <li>✓ 原始 CSS 類名結構</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">🔧 技術實現</h3>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>✓ Playwright 計算樣式分析</li>
                  <li>✓ 內聯樣式精確匹配</li>
                  <li>✓ FontAwesome 圖標整合</li>
                  <li>✓ 動態深色模式切換</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚡ 互動功能</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>✓ 搜索框實時輸入</li>
                  <li>✓ 導航 hover 效果</li>
                  <li>✓ 深色模式切換</li>
                  <li>✓ 土耳其語日期顯示</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">📊 結構層次</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div><strong>1. TradingView Widget：</strong>簡單 placeholder（用戶將嵌入真實 iframe）</div>
                <div><strong>2. jeg_topbar：</strong>深色背景（rgb(33,33,33)），日期 + 菜單 + 搜索 + 深色模式</div>
                <div><strong>3. jeg_midbar：</strong>白色背景，中央 Logo 區域</div>
                <div><strong>4. jeg_bottombar：</strong>白色背景（高度50px），主要導航 + 搜索框</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">🎯 重要改進</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li><strong>搜索框樣式：</strong>使用真實的 33px 圓角和正確的邊框顏色</li>
                <li><strong>導航字體：</strong>15px 粗體，Helvetica Neue 字體系列</li>
                <li><strong>精確高度：</strong>topbar 34px，bottombar 50px</li>
                <li><strong>Hover 效果：</strong>正確的紅色過渡效果</li>
                <li><strong>TradingView：</strong>簡化為 placeholder，等待用戶嵌入</li>
              </ul>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-800 mb-3">🚀 下一步驟</h3>
              <p className="text-indigo-700 text-sm">
                現在 Header 已經完美復刻了 kriptosaat.com 的設計。
                用戶可以在 TradingView Widget 區域嵌入真實的 iframe，
                並開始將此 Header 整合到主要頁面佈局中。
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-3">🎯 Sticky Header 測試</h3>
              <p className="text-orange-700 text-sm mb-4">
                向下滾動頁面超過150px，您將看到一個sticky header顯示在頂部，包含：
              </p>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>✓ 左側：Logo（從STRAPI動態載入）</li>
                <li>✓ 中間：主導航菜單（桌面版）</li>
                <li>✓ 右側：搜索按鈕 + 移動菜單按鈕</li>
                <li>✓ 平滑的滑入/滑出動畫</li>
                <li>✓ 右上角實時滾動位置指示器</li>
              </ul>
            </div>

            {/* 添加更多內容以供滾動測試 */}
            <div className="space-y-6">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="bg-gray-100 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    測試內容區塊 {i + 1}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    這是用於測試 sticky header 功能的示例內容。
                    當您向下滾動頁面時，您應該能夠看到 sticky header 在頂部顯示。
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h5 className="font-medium text-gray-800 mb-2">功能特點</h5>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• 響應式設計</li>
                        <li>• 平滑動畫效果</li>
                        <li>• 移動端友好</li>
                        <li>• 搜索功能整合</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h5 className="font-medium text-gray-800 mb-2">技術實現</h5>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li>• 滾動監聽器</li>
                        <li>• CSS 過渡效果</li>
                        <li>• 條件渲染</li>
                        <li>• 狀態管理</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 