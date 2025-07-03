"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NavigationItem } from '@/types/header';

interface MobileSidebarProps {
  isOpen: boolean;
  isClosing: boolean;
  isAnimatingIn: boolean;
  onClose: () => void;
  navigationItems?: NavigationItem[];
  searchPlaceholder?: string;
}

export default function MobileSidebar({ 
  isOpen, 
  isClosing, 
  isAnimatingIn, 
  onClose,
  navigationItems = [],
  searchPlaceholder = 'Ara...'
}: MobileSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳轉到主站搜尋頁面
      const searchUrl = `https://kriptosaat.com/?s=${encodeURIComponent(searchQuery.trim())}`;
      window.open(searchUrl, '_blank');
      setSearchQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Black Semi-transparent Overlay */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-50'
        }`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isClosing ? '-translate-x-full' : (isAnimatingIn ? 'translate-x-0' : '-translate-x-full')
        }`}
      >
        <div className="p-6">
          {/* Search Box */}
          <div className="mb-6">
            <form className="flex items-center" onSubmit={handleSearchSubmit}>
              <input
                name="s"
                className="w-full"
                placeholder={searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  border: '1px solid rgb(224, 224, 224)',
                  borderRadius: '33px',
                  padding: '10px 15px',
                  fontSize: '14px',
                  color: 'rgb(0, 0, 0)',
                  outline: 'none'
                }}
              />
              <button 
                type="submit" 
                className="ml-2 hover:opacity-70 transition-opacity"
                aria-label="Search Button"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  color: 'rgb(33, 33, 33)',
                  border: '0px none',
                  borderRadius: '0px',
                  padding: '8px'
                }}
              >
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>

          {/* Navigation Menu - 動態渲染，支援下拉選單 */}
          <nav>
            <ul className="space-y-4">
              {navigationItems && navigationItems.length > 0 ? (
                navigationItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.url} 
                      className="block py-2 text-black hover:text-red-600 transition-colors"
                      onClick={onClose}
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                        textDecoration: 'none'
                      }}
                    >
                      {item.text}
                      {item.hasDropdown && (
                        <i className="fa fa-angle-down ml-2" style={{ fontSize: '12px' }}></i>
                      )}
                    </Link>
                    
                    {/* 手機版下拉選單項目 */}
                    {item.hasDropdown && item.children && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.children
                          .filter(child => child.isActive)
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.url}
                                target={child.openInNewTab ? '_blank' : '_self'}
                                className="block py-1 text-gray-600 hover:text-red-600 transition-colors"
                                onClick={onClose}
                                style={{
                                  fontSize: '14px',
                                  fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                                  textDecoration: 'none'
                                }}
                              >
                                {child.icon && (
                                  <i className={`fa ${child.icon} mr-2`} style={{ fontSize: '11px' }}></i>
                                )}
                                {child.title}
                                {child.badge && (
                                  <span className="ml-2 px-1 py-0.5 bg-red-500 text-white text-xs rounded">
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))
                        }
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                // 預設值作為 fallback
                <>
                  <li>
                    <Link 
                      href="/flash" 
                      className="block py-2 text-black hover:text-red-600 transition-colors"
                      onClick={onClose}
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                        textDecoration: 'none'
                      }}
                    >
                      ⚡️24/7 Flash Haberler
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/bitcoin" 
                      className="block py-2 text-black hover:text-red-600 transition-colors"
                      onClick={onClose}
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                        textDecoration: 'none'
                      }}
                    >
                      Bitcoin
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/ethereum-solana" 
                      className="block py-2 text-black hover:text-red-600 transition-colors"
                      onClick={onClose}
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                        textDecoration: 'none'
                      }}
                    >
                      Ethereum/Solana
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/category/haberler" 
                      className="block py-2 text-black hover:text-red-600 transition-colors"
                      onClick={onClose}
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                        textDecoration: 'none'
                      }}
                    >
                      Haberler
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/rehberler" 
                      className="block py-2 text-black hover:text-red-600 transition-colors"
                      onClick={onClose}
                      style={{ 
                        fontSize: '16px', 
                        fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                        textDecoration: 'none'
                      }}
                    >
                      Rehberler
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Social Media Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <i className="fa fa-facebook text-xl"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Twitter"
              >
                <i className="fa fa-twitter text-xl"></i>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-xs text-gray-500">
            © 2025 Kriptosaat
          </div>
        </div>
      </div>
    </>
  );
} 