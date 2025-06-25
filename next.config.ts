import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
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
  
  // 處理代理請求
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
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
};

export default nextConfig;
