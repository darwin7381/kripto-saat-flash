import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 啟用 standalone 模式（Cloud Run 需要）
  output: 'standalone',
  
  // 設置靜態資源前綴，確保通過正確的域名訪問
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://flash.kriptosaat.com' : '',
  
  // 支援代理環境
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // 處理代理請求和路由重寫
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // 重寫 flash-* 路徑到 /flash/* 以支援 Cloudflare Worker 的路徑映射
      {
        source: '/:slug(flash-.*)',
        destination: '/flash/:slug',
      },
    ];
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // 開發環境的 STRAPI 圖片支援
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // 為未來的圖片CDN預留配置
      {
        protocol: 'https',
        hostname: 'cdn.kriptosaat.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  
  // 處理第三方腳本可能造成的 hydration 問題
  experimental: {
    // 提升 hydration 錯誤的容錯性
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  // 產生環境隱藏 hydration 警告（只影響開發環境的 console）
  compiler: {
    // 移除 console.log（可選，用於生產環境）
    // removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 確保正確的環境變數傳遞
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
