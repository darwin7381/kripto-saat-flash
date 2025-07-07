"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderData } from '@/types/header';
import MainNavigation from './MainNavigation';
import SearchButton from './SearchButton';
import HamburgerMenu from './HamburgerMenu';
import MobileSidebar from './MobileSidebar';

interface StickyHeaderProps {
  headerData: HeaderData | null;
}

export default function StickyHeader({ headerData }: StickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 當滾動超過 150px 時顯示 sticky header（降低閾值）
      if (currentScrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 打開側邊欄動畫
  const openSidebar = () => {
    setIsMobileMenuOpen(true);
    setTimeout(() => {
      setIsAnimatingIn(true);
    }, 10);
  };

  // 關閉側邊欄動畫
  const closeSidebar = () => {
    setIsClosing(true);
    setIsAnimatingIn(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  if (!headerData) return null;

  // 動態選擇 Logo URL 和 alt text - 手機版使用白色Logo，桌面版使用原始邏輯
  const currentLogo = isDarkMode ? headerData.logoDark : headerData.logoLight;
  // 手機版（黑底）使用白色Logo，桌面版使用原始邏輯
  const logoSrc = currentLogo?.url || (isDarkMode 
    ? "https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png"
    : "https://kriptosaat.com/wp-content/uploads/2025/06/b9fdf65408.png"
  );
  // 針對手機版強制使用白色Logo
  const mobileLogo = headerData.logoDark?.url || "https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png";
  const logoAlt = currentLogo?.alt || headerData.logoText || "Kripto Saat";

  return (
    <>
      {/* Sticky Header */}
      <div 
        className={`
          fixed top-0 left-0 right-0 z-50 bg-black lg:bg-white border-b border-gray-100
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}
        `}
        style={{ height: '60px' }}
      >
        <div className="max-w-[1200px] mx-auto px-[15px] h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left - Hamburger Menu (Mobile) / Logo (Desktop) */}
            <div className="flex items-center">
              {/* Mobile Hamburger Menu */}
              <div className="lg:hidden">
                <HamburgerMenu onClick={openSidebar} />
              </div>
              
              {/* Desktop Logo */}
              <div className="hidden lg:block">
                <Link href={headerData.logoUrl || "/"} className="flex items-center">
                  <Image 
                    src={logoSrc}
                    alt={logoAlt}
                    title={headerData.logoText || "Kripto Saat"}
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
            </div>

            {/* Center - Logo (Mobile) / Main Navigation (Desktop) */}
            <div className="flex items-center justify-center flex-1">
              {/* Mobile Logo */}
              <div className="lg:hidden">
                <Link href={headerData.logoUrl || "/"} className="flex items-center">
                  <Image 
                    src={mobileLogo}
                    alt={logoAlt}
                    title={headerData.logoText || "Kripto Saat"}
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex">
                <MainNavigation navigationItems={headerData.mainNavigation} />
              </div>
            </div>

            {/* Right - Search Button */}
            <div className="flex items-center">
              {headerData.enableSearch && (
                <SearchButton placeholder={headerData.searchPlaceholder} />
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
        navigationItems={headerData.mainNavigation}
        searchPlaceholder={headerData.searchPlaceholder}
      />
    </>
  );
} 