import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  },
};

export default nextConfig;
