import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET() {
  try {
    // 使用正確的 Strapi 5 深層 populate 語法（URL 編碼）
    const queryString = 'populate%5BmainNavigation%5D%5Bpopulate%5D=*&populate%5BtopBar%5D=*';
    
    const response = await fetch(`${STRAPI_URL}/api/header?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // 不設定 Next.js revalidate，因為我們要用 Cloudflare 永久快取
    });

    if (!response.ok) {
      throw new Error(`Strapi responded with status: ${response.status}`);
    }

    const strapiResponse = await response.json();
    console.log('STRAPI 完整回應:', JSON.stringify(strapiResponse, null, 2));
    
    // Strapi 5 的數據結構是扁平的，直接在 data 中
    const strapiData = strapiResponse.data;
    
    // 轉換 Strapi 數據格式為前端需要的格式
    const headerData = {
      logoText: strapiData?.logoText || 'Kripto Saat',
      logoUrl: strapiData?.logoUrl || '/',
      logoLight: strapiData?.logoLight?.data ? {
        url: strapiData.logoLight.data.url,
        alt: strapiData.logoLight.data.alternativeText || 'Kripto Saat Light Logo'
      } : {
        url: 'https://kriptosaat.com/wp-content/uploads/2025/06/b9fdf65408.png',
        alt: 'Kripto Saat Light Logo'
      },
      logoDark: strapiData?.logoDark?.data ? {
        url: strapiData.logoDark.data.url,
        alt: strapiData.logoDark.data.alternativeText || 'Kripto Saat Dark Logo'
      } : {
        url: 'https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png',
        alt: 'Kripto Saat Dark Logo'
      },
      // 正確處理 STRAPI mainNavigation 數據，包含下拉選單
      mainNavigation: Array.isArray(strapiData?.mainNavigation) ? 
        strapiData.mainNavigation
          .filter((item: any) => item.isActive !== false) // 預設啟用，除非明確設為 false
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) // 使用 STRAPI 的 order 欄位
          .map((item: any) => ({
            text: item.title,
            url: item.url,
            hasDropdown: item.hasDropdown || false,
            children: item.dropdownItems && Array.isArray(item.dropdownItems) ? 
              item.dropdownItems
                .filter((child: any) => child.isActive !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((child: any) => ({
                  id: child.id,
                  title: child.title,
                  url: child.url,
                  description: child.description || '',
                  icon: child.icon || '',
                  isExternal: child.isExternal || false,
                  openInNewTab: child.openInNewTab || false,
                  order: child.order || 0,
                  isActive: child.isActive !== false,
                  badge: child.badge || '',
                  cssClass: child.cssClass || ''
                })) : []
          })) : [
        // 預設值
        { text: '⚡️24/7 Flash Haberler', url: '/flash' },
        { text: 'Bitcoin', url: '/category/bitcoin' },
        { text: 'Ethereum/Solana', url: '/category/ethereum-solana' },
        { text: 'Haberler', url: '/category/haberler' },
        { text: 'Rehberler', url: '/rehberler' }
      ],
      enableSearch: strapiData?.enableSearch ?? true,
      searchPlaceholder: strapiData?.searchPlaceholder || 'Ara...',
      // 直接使用 STRAPI topBar 數據，但移除 htmlContent
      topBar: strapiData?.topBar ? {
        enableTopBar: strapiData.topBar.enableTopBar ?? true,
        backgroundColor: strapiData.topBar.backgroundColor || '#212121',
        height: strapiData.topBar.height || '40px',
        htmlContent: '' // 強制移除 htmlContent，使用傳統的天氣+深色模式布局
      } : {
        enableTopBar: true,
        backgroundColor: '#212121',
        height: '40px',
        htmlContent: ''
      }
    };

    console.log('處理後的 headerData:', JSON.stringify(headerData, null, 2));

    return NextResponse.json(headerData, {
      headers: {
        // 遵循 Cloudflare-First 架構：永久快取策略
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Cache-Tag': 'header-config,header-navigation,header-global',
        'X-Cache-Type': 'header',
        'X-Cache-Generated': new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Header API Error:', error);
    
    // 發生錯誤時返回預設值
    return NextResponse.json({
      logoText: 'Kripto Saat',
      logoUrl: '/',
      logoLight: {
        url: 'https://kriptosaat.com/wp-content/uploads/2025/06/b9fdf65408.png',
        alt: 'Kripto Saat Light Logo'
      },
      logoDark: {
        url: 'https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png',
        alt: 'Kripto Saat Dark Logo'
      },
      mainNavigation: [
        { text: '⚡️24/7 Flash Haberler', url: '/flash' },
        { text: 'Bitcoin', url: '/category/bitcoin' },
        { text: 'Ethereum/Solana', url: '/category/ethereum-solana' },
        { text: 'Haberler', url: '/category/haberler' },
        { text: 'Rehberler', url: '/rehberler' }
      ],
      enableSearch: true,
      searchPlaceholder: 'Ara...',
      topBar: {
        enableTopBar: true,
        backgroundColor: '#212121',
        height: '40px',
        htmlContent: ''
      }
    }, {
      headers: {
        // 錯誤時也使用永久快取，確保系統穩定性
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Cache-Tag': 'header-config,header-fallback,header-global',
        'X-Cache-Type': 'header-fallback',
        'X-Cache-Generated': new Date().toISOString(),
        'X-Cache-Error': 'strapi-unavailable',
      },
    });
  }
} 