export const config = {
  // StrAPI Configuration
  strapi: {
    url: process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'https://str.kriptosaat.com',
    // 前端讀取內容無需API Token，使用公開API
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD || '',
  },

  // Cloudflare Configuration
  cloudflare: {
    token: process.env.CLOUDFLARE_TOKEN || '',
    zoneId: process.env.CLOUDFLARE_ZONE_ID || '',
  },

  // WordPress Integration
  wordpress: {
    url: process.env.WORDPRESS_URL || 'http://localhost:8080',
    apiUrl: process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json/wp/v2',
  },

  // App Configuration
  // 注意：不使用 Next.js basePath，路由結構通過 Cloudflare Worker 和文件位置處理
  app: {
    // basePath 已禁用，使用 Worker 路由轉發 + 文件位置管理路由
  },

  // Site Configuration
  site: {
    url: process.env.SITE_URL || 'http://localhost:3000',
    flashSubdomain: process.env.FLASH_SUBDOMAIN || 'http://localhost:3000',
    name: process.env.SITE_NAME || 'Kripto Saat Flash',
  },

  // SEO Configuration
  seo: {
    twitterHandle: '@kriptosaat',
  },

  // API Configuration
  api: {
    itemsPerPage: 25, // 每頁快訊數量
    hotPagesLimit: 10, // 熱門頁面限制（系統一）
    segmentSize: 25, // 歷史區段大小（系統二）
    updateCheckInterval: 60000, // 更新檢查間隔（毫秒）- 1分鐘
  },

  // Development Configuration
  isDevelopment: process.env.NODE_ENV === 'development',
}; 