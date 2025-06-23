export const config = {
  // StrAPI Configuration
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    apiToken: process.env.STRAPI_API_TOKEN || '',
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
  },

  // Development Configuration
  isDevelopment: process.env.NODE_ENV === 'development',
}; 