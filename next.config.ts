import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 啟用 standalone 模式（Cloud Run 需要）
  output: 'standalone',
  
  // 基本安全 headers
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
  
  // Cloudflare Worker 路由重寫 - 修正版本
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // 移除錯誤的 flash-* 規則，現在由 Worker 正確處理
    ];
  },
  
  // 圖片支援
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'str.kriptosaat.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'kriptosaat.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
