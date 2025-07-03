"use client";

import { useState } from 'react';
import Link from 'next/link';
import { NavigationItem } from '@/types/header';

interface MainNavigationProps {
  className?: string;
  navigationItems?: NavigationItem[];
}

const defaultNavigationItems: NavigationItem[] = [
  { text: "Hey Hey", url: "#" },
  { text: "⚡24/7 Flash Haberler", url: "/flash" },
  { text: "Bitcoin", url: "/bitcoin" },
  { text: "Ethereum/Solana", url: "/ethereum-solana" },
  { text: "Haberler", url: "/haberler" },
  { text: "Rehberler", url: "/rehberler" }
];

export default function MainNavigation({ className = "", navigationItems = defaultNavigationItems }: MainNavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <div className={`jeg_nav_col jeg_nav_center jeg_nav_grow flex justify-center ${className}`}>
      <div className="item_wrap jeg_nav_aligncenter">
        <div className="jeg_nav_item jeg_main_menu_wrapper">
          <div className="jeg_mainmenu_wrap">
            <ul className="jeg_menu jeg_main_menu jeg_menu_style_1 flex space-x-8">
              {navigationItems.map((item, index) => (
                <li 
                  key={index} 
                  className="menu-item bgnav relative"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(index)}
                  onMouseLeave={() => item.hasDropdown && handleMouseLeave()}
                >
                  <Link 
                    href={item.url} 
                    className="hover:text-red-600 transition-colors flex items-center"
                    style={{ 
                      color: 'rgb(33, 33, 33)', 
                      fontSize: '15px', 
                      fontWeight: '700',
                      fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                      textDecoration: 'none'
                    }}
                  >
                    {item.text}
                    {item.hasDropdown && (
                      <i className="fa fa-angle-down ml-1" style={{ fontSize: '12px' }}></i>
                    )}
                  </Link>

                  {/* 下拉選單 */}
                  {item.hasDropdown && item.children && openDropdown === index && (
                    <ul 
                      className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-md py-2 z-50 min-w-48"
                      style={{ marginTop: '2px' }}
                    >
                      {item.children
                        .filter(child => child.isActive)
                        .sort((a, b) => a.order - b.order)
                        .map((child) => (
                          <li key={child.id} className="px-0">
                            <Link
                              href={child.url}
                              target={child.openInNewTab ? '_blank' : '_self'}
                              className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                              style={{
                                color: 'rgb(33, 33, 33)',
                                fontSize: '14px',
                                fontFamily: '"Helvetica Neue", Helvetica, Roboto, Arial, sans-serif',
                                textDecoration: 'none'
                              }}
                            >
                              {child.icon && (
                                <i className={`fa ${child.icon} mr-2`} style={{ fontSize: '12px' }}></i>
                              )}
                              {child.title}
                              {child.badge && (
                                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 