"use client";

import { useState, useRef, useEffect } from 'react';

interface SearchButtonProps {
  className?: string;
  placeholder?: string;
}

export default function SearchButton({ className = "", placeholder = "Ara..." }: SearchButtonProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 點擊外部時關閉搜尋框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // 當搜尋框打開時自動聚焦
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 跳轉到主站搜尋頁面
      const searchUrl = `https://kriptosaat.com/?s=${encodeURIComponent(searchQuery.trim())}`;
      window.open(searchUrl, '_blank');
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className={`jeg_nav_col jeg_nav_right jeg_nav_normal ${className}`} ref={containerRef}>
      <div className="item_wrap jeg_nav_alignright relative">
        <div className="jeg_nav_item jeg_nav_search">
          {/* 搜尋按鈕 */}
          <button 
            onClick={handleSearchToggle}
            className="search-icon hover:opacity-70 transition-opacity"
            aria-label="Search Button"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'rgb(33, 33, 33)',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <i className={`fa ${isSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
          </button>

          {/* 搜尋輸入框 */}
          {isSearchOpen && (
            <div 
              className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
              style={{
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <form onSubmit={handleSearchSubmit} className="p-3">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="執行搜尋"
                    title="執行搜尋"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 