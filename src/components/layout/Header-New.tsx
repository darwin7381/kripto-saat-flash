"use client";

import { useState } from 'react';
import Link from 'next/link';
import WeatherDisplay from './WeatherDisplay';
import DarkModeToggle from './DarkModeToggle';
import MainNavigation from './MainNavigation';
import MobileSidebar from './MobileSidebar';
import Logo from './Logo';
import HamburgerMenu from './HamburgerMenu';
import SearchButton from './SearchButton';
import TradingViewWidget from './TradingViewWidget';
import StickyHeader from './StickyHeader';
import { useHeader } from '@/lib/hooks/useHeader';

export default function HeaderNew() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  
  // 獲取 Header 配置數據
  const { headerData, loading, error } = useHeader();

  // 打開側邊欄動畫
  const openSidebar = () => {
    setIsMobileMenuOpen(true);
    setTimeout(() => {
      setIsAnimatingIn(true);
    }, 10); // 短暫延遲確保動畫生效
  };

  // 關閉側邊欄動畫
  const closeSidebar = () => {
    setIsClosing(true);
    setIsAnimatingIn(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300); // 動畫持續時間
  };

  // 錯誤處理
  if (error) {
    console.error('Header data error:', error);
  }

  // 載入狀態
  if (loading) {
  return (
      <div className="jeg_header normal">
        <div className="jeg_topbar" style={{ backgroundColor: 'rgb(33, 33, 33)', height: '40px' }}>
          <div className="max-w-[1200px] mx-auto px-[15px] h-full flex items-center justify-center">
            <span className="text-white text-sm">載入中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* TradingView Widget */}
      <TradingViewWidget />

      {/* jeg_header normal */}
      <div className="jeg_header normal">
        
        {/* jeg_topbar - 恢復原本的黑底設計，手機版隱藏 */}
        {headerData?.topBar?.enableTopBar && (
          <div 
            className="jeg_topbar hidden lg:block" 
            style={{ 
              backgroundColor: headerData.topBar.backgroundColor || 'rgb(33, 33, 33)', 
              height: headerData.topBar.height || '40px', 
              color: 'rgb(245, 245, 245)' 
            }}
          >
            <div className="max-w-[1200px] mx-auto px-[15px] h-full">
            <div className="jeg_nav_row flex items-center justify-between h-full">
                {/* Left - 天氣 + 日期 */}
                <WeatherDisplay />

                {/* Right - 深色模式切換 */}
                <DarkModeToggle 
                  isDarkMode={isDarkMode} 
                  onToggle={setIsDarkMode} 
                />
              </div>
            </div>
          </div>
        )}

        {/* jeg_midbar - Logo，手機版隱藏 */}
        <div className="hidden lg:block">
          <Logo 
            isDarkMode={isDarkMode} 
            logoText={headerData?.logoText}
            logoUrl={headerData?.logoUrl}
            logoLight={headerData?.logoLight}
            logoDark={headerData?.logoDark}
          />
        </div>

        {/* jeg_bottombar - 精確復刻，手機版全黑底 */}
        <div className="jeg_bottombar jeg_navbar jeg_container jeg_navbar_wrapper jeg_navbar_normal bg-black lg:bg-white" 
             style={{ height: '50px' }}>
          <div className="max-w-[1200px] mx-auto px-[15px] h-full">
            <div className="jeg_nav_row flex items-center justify-between h-full">
              
              {/* Left - Hamburger Menu */}
              <HamburgerMenu onClick={openSidebar} />

              {/* Center - Main Menu (Desktop) / Logo (Mobile) */}
              <div className="flex items-center justify-center flex-1">
                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                  <MainNavigation navigationItems={headerData?.mainNavigation} />
                </div>
                
                {/* Mobile Logo */}
                <div className="lg:hidden">
                  <Link href={headerData?.logoUrl || "/"} className="flex items-center">
                    <img 
                      src={headerData?.logoDark?.url || "https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png"}
                      alt={headerData?.logoText || "Kripto Saat"}
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>
              </div>

              {/* Right - Search Icon */}
              {headerData?.enableSearch && (
                <SearchButton placeholder={headerData?.searchPlaceholder} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen}
        isClosing={isClosing}
        isAnimatingIn={isAnimatingIn}
        onClose={closeSidebar}
        navigationItems={headerData?.mainNavigation}
        searchPlaceholder={headerData?.searchPlaceholder}
      />

      {/* Sticky Header */}
      <StickyHeader headerData={headerData} />

      {/* FontAwesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    </>
  );
} 