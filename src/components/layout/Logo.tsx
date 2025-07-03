"use client";

import Link from 'next/link';
import Image from 'next/image';
import { LogoImage } from '@/types/header';

interface LogoProps {
  isDarkMode: boolean;
  className?: string;
  logoText?: string;
  logoUrl?: string;
  logoLight?: LogoImage;
  logoDark?: LogoImage;
}

export default function Logo({ 
  isDarkMode, 
  className = "", 
  logoText = "Kripto Saat", 
  logoUrl = "/",
  logoLight,
  logoDark
}: LogoProps) {
  // 動態選擇 Logo URL 和 alt text
  const currentLogo = isDarkMode ? logoDark : logoLight;
  const logoSrc = currentLogo?.url || (isDarkMode 
    ? "https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png"
    : "https://kriptosaat.com/wp-content/uploads/2025/06/b9fdf65408.png"
  );
  const logoAlt = currentLogo?.alt || logoText;

  return (
    <div className={`jeg_midbar jeg_container jeg_navbar_wrapper normal ${className}`} 
         style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="jeg_nav_row flex items-center justify-center py-6">
          <div className="jeg_nav_item jeg_logo jeg_desktop_logo">
            <h1 className="site-title">
              <Link href={logoUrl} aria-label="Visit Homepage" className="block">
                <Image 
                  className="jeg_logo_img h-16 w-auto"
                  src={logoSrc}
                  alt={logoAlt} 
                  title={logoText}
                  width={272} 
                  height={95}
                />
              </Link>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
} 