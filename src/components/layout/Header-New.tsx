"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeaderNew() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 獲取當前日期（土耳其語格式）
  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('tr-TR', options);
  };

  return (
    <>
      {/* TradingView Widget - 簡單的 placeholder */}
      <div id="tv-ticker-wrapper" className="w-full relative z-10 m-0 p-0">
        <div className="bg-gray-200 text-center py-3 text-sm text-gray-600">
          TradingView Widget (將由用戶嵌入真實 iframe)
        </div>
      </div>

      {/* jeg_header normal */}
      <div className="jeg_header normal">
        
        {/* jeg_topbar - 精確復刻 */}
        <div className="jeg_topbar" style={{ backgroundColor: 'rgb(33, 33, 33)', height: '34px', color: 'rgb(245, 245, 245)' }}>
          <div className="container mx-auto px-4">
            <div className="jeg_nav_row flex items-center justify-between h-full">
              
              {/* Left - 日期 + 主要菜單 */}
              <div className="jeg_nav_col jeg_nav_left jeg_nav_grow">
                <div className="item_wrap jeg_nav_alignleft flex items-center space-x-6">
                  <div className="jeg_nav_item jeg_top_date text-sm">
                    {getCurrentDate()}
                  </div>
                  <div className="jeg_nav_item">
                    <ul className="jeg_menu jeg_top_menu flex space-x-6 text-sm">
                      <li className="menu-item">
                        <Link href="/flash" className="hover:opacity-80 transition-opacity">⚡️24/7 Flash Haberler</Link>
                      </li>
                      <li className="menu-item">
                        <Link href="/category/bitcoin" className="hover:opacity-80 transition-opacity">Bitcoin</Link>
                      </li>
                      <li className="menu-item">
                        <Link href="/category/ethereum-solana" className="hover:opacity-80 transition-opacity">Ethereum/Solana</Link>
                      </li>
                      <li className="menu-item">
                        <Link href="/category/haberler" className="hover:opacity-80 transition-opacity">Haberler</Link>
                      </li>
                      <li className="menu-item">
                        <Link href="/rehberler" className="hover:opacity-80 transition-opacity">Rehberler</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right - 搜索 + 深色模式 */}
              <div className="jeg_nav_col jeg_nav_right jeg_nav_normal">
                <div className="item_wrap jeg_nav_alignright flex items-center space-x-4">
                  {/* Search Icon */}
                  <div className="jeg_nav_item jeg_search_wrapper search_icon jeg_search_popup_expand">
                    <button 
                      aria-label="Search Button"
                      className="jeg_search_toggle hover:opacity-80 transition-opacity"
                    >
                      <i className="fa fa-search text-sm"></i>
                    </button>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="jeg_nav_item jeg_dark_mode">
                    <label className="dark_mode_switch flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="jeg_dark_mode_toggle sr-only"
                        checked={isDarkMode}
                        onChange={(e) => setIsDarkMode(e.target.checked)}
                        aria-label="Dark mode toggle"
                      />
                      <span className="slider round">
                        <div className="relative">
                          <div className={`block bg-gray-600 w-8 h-4 rounded-full transition-colors ${isDarkMode ? 'bg-red-500' : ''}`}></div>
                          <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${isDarkMode ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* jeg_midbar - 精確復刻 */}
        <div className="jeg_midbar jeg_container jeg_navbar_wrapper normal" style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
          <div className="container mx-auto">
            <div className="jeg_nav_row flex items-center justify-center py-6">
              <div className="jeg_nav_item jeg_logo jeg_desktop_logo">
                <h1 className="site-title">
                  <Link href="/" aria-label="Visit Homepage" className="block">
                    <Image 
                      className="jeg_logo_img h-16 w-auto"
                      src={isDarkMode 
                        ? "https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png"
                        : "https://kriptosaat.com/wp-content/uploads/2025/06/b9fdf65408.png"
                      }
                      alt="kriptosaat.com" 
                      width={272} 
                      height={95}
                    />
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* jeg_bottombar - 精確復刻 */}
        <div className="jeg_bottombar jeg_navbar jeg_container jeg_navbar_wrapper jeg_navbar_normal" 
             style={{ backgroundColor: 'rgb(255, 255, 255)', height: '50px' }}>
          <div className="container mx-auto">
            <div className="jeg_nav_row flex items-center justify-between h-full">
              
              {/* Left - Main Menu */}
              <div className="jeg_nav_col jeg_nav_left jeg_nav_grow">
                <div className="item_wrap jeg_nav_aligncenter">
                  <div className="jeg_nav_item jeg_main_menu_wrapper">
                    <div className="jeg_mainmenu_wrap">
                      <ul className="jeg_menu jeg_main_menu jeg_menu_style_1 flex space-x-8">
                        <li className="menu-item bgnav">
                          <Link 
                            href="/flash" 
                            className="hover:text-red-600 transition-colors"
                            style={{ 
                              color: 'rgb(33, 33, 33)', 
                              fontSize: '15px', 
                              fontWeight: '700',
                              fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                              textDecoration: 'none'
                            }}
                          >
                            ⚡️24/7 Flash Haberler
                          </Link>
                        </li>
                        <li className="menu-item bgnav">
                          <Link 
                            href="/category/bitcoin" 
                            className="hover:text-red-600 transition-colors"
                            style={{ 
                              color: 'rgb(33, 33, 33)', 
                              fontSize: '15px', 
                              fontWeight: '700',
                              fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                              textDecoration: 'none'
                            }}
                          >
                            Bitcoin
                          </Link>
                        </li>
                        <li className="menu-item bgnav">
                          <Link 
                            href="/category/ethereum-solana" 
                            className="hover:text-red-600 transition-colors"
                            style={{ 
                              color: 'rgb(33, 33, 33)', 
                              fontSize: '15px', 
                              fontWeight: '700',
                              fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                              textDecoration: 'none'
                            }}
                          >
                            Ethereum/Solana
                          </Link>
                        </li>
                        <li className="menu-item bgnav">
                          <Link 
                            href="/category/haberler" 
                            className="hover:text-red-600 transition-colors"
                            style={{ 
                              color: 'rgb(33, 33, 33)', 
                              fontSize: '15px', 
                              fontWeight: '700',
                              fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                              textDecoration: 'none'
                            }}
                          >
                            Haberler
                          </Link>
                        </li>
                        <li className="menu-item bgnav">
                          <Link 
                            href="/rehberler" 
                            className="hover:text-red-600 transition-colors"
                            style={{ 
                              color: 'rgb(33, 33, 33)', 
                              fontSize: '15px', 
                              fontWeight: '700',
                              fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                              textDecoration: 'none'
                            }}
                          >
                            Rehberler
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Search Form */}
              <div className="jeg_nav_col jeg_nav_right jeg_nav_normal">
                <div className="item_wrap jeg_nav_alignright">
                  <div className="jeg_nav_item jeg_nav_search">
                    <div className="jeg_search_wrapper jeg_search_no_expand round flex items-center">
                      <form className="jeg_search_form flex items-center" method="get" action="/">
                        <input
                          name="s"
                          className="jeg_search_input"
                          placeholder="Search..."
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoComplete="off"
                          style={{
                            backgroundColor: 'rgb(255, 255, 255)',
                            border: '1px solid rgb(224, 224, 224)',
                            borderRadius: '33px',
                            padding: '7px 15px',
                            fontSize: '14px',
                            color: 'rgb(0, 0, 0)',
                            outline: 'none',
                            width: '200px'
                          }}
                        />
                        <button 
                          type="submit" 
                          className="jeg_search_button btn hover:opacity-70 transition-opacity"
                          aria-label="Search Button"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            color: 'rgb(33, 33, 33)',
                            border: '0px none',
                            borderRadius: '0px',
                            padding: '0px 12px 0px 10px'
                          }}
                        >
                          <i className="fa fa-search"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FontAwesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    </>
  );
} 