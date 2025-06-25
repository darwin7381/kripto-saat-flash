"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [currency, setCurrency] = useState('CNY');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 確保組件只在客戶端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 點擊外部關閉下拉菜單
  useEffect(() => {
    if (!mounted) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.currency-dropdown')) {
        setShowCurrencyDropdown(false);
      }
    };

    if (showCurrencyDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCurrencyDropdown, mounted]);

  return (
    <>
      {/* 佔位元素，防止內容被固定的 header 遮擋 */}
      <div className="h-[56px]"></div>
      
      <header className="bg-[#5B7BFF] text-white fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[56px]">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="bg-white/20 rounded px-4 py-1.5 hover:bg-white/30 transition-colors">
                  <span className="text-[18px] font-bold">币世界</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/flash" className="relative pb-1 hover:text-white/90 transition-colors border-b-2 border-white">
                快讯
              </Link>
              <Link href="/analysis" className="hover:text-white/90 transition-colors">
                分析
              </Link>
              <Link href="/depth" className="hover:text-white/90 transition-colors">
                深度
              </Link>
              <Link href="/market" className="hover:text-white/90 transition-colors">
                行情
              </Link>
              <Link href="/square" className="hover:text-white/90 transition-colors">
                广场
              </Link>
              <Link href="/join" className="hover:text-white/90 transition-colors">
                加入我们
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-5">
              {/* Currency Selector */}
              <div className="relative currency-dropdown">
                <button 
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center space-x-2 text-sm hover:text-white/90 transition-colors"
                >
                  <span>人民币 {currency}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* 只在客戶端 mounted 後才渲染下拉菜單 */}
                {mounted && showCurrencyDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded shadow-lg py-2 min-w-[120px] z-50">
                    <button 
                      onClick={() => { setCurrency('CNY'); setShowCurrencyDropdown(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      人民币 CNY
                    </button>
                    <button 
                      onClick={() => { setCurrency('USD'); setShowCurrencyDropdown(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      美元 USD
                    </button>
                  </div>
                )}
              </div>

              {/* Auth Links */}
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/login" className="hover:text-white/90 transition-colors">
                  登录
                </Link>
                <Link href="/register" className="hover:text-white/90 transition-colors">
                  注册
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
} 