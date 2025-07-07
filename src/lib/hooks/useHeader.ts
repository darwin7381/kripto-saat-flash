"use client";

import { useState, useEffect } from 'react';
import { HeaderData } from '@/types/header';

export function useHeader() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setLoading(true);
        console.log('🔍 useHeader: 開始獲取 header 數據...');
        
        const response = await fetch('/flash/api/header');
        console.log('🔍 useHeader: API 回應狀態:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('🔍 useHeader: 獲取到的數據:', data);
        
        setHeaderData(data);
        setError(null);
        console.log('✅ useHeader: 數據設置成功');
      } catch (err) {
        console.error('❌ useHeader: 獲取 header 數據失敗:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        // 設置與當前 API 一致的預設值
        const fallbackData = {
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
          // 更新為與 API 一致的新版本預設值
          mainNavigation: [
            { text: 'Hey Hey', url: '#', hasDropdown: false, children: [] },
            { text: '⚡24/7 Flash Haberler', url: '/flash', hasDropdown: false, children: [] },
            { text: 'Bitcoin', url: '/bitcoin', hasDropdown: false, children: [] },
            { text: 'Ethereum/Solana', url: '/ethereum-solana', hasDropdown: false, children: [] },
            { text: 'Haberler', url: '/haberler', hasDropdown: false, children: [] },
            { text: 'Rehberler', url: '/rehberler', hasDropdown: false, children: [] }
          ],
          enableSearch: true,
          searchPlaceholder: 'Ara...',
          topBar: {
            enableTopBar: true,
            backgroundColor: '#1a1a1a', // 更新為正確的背景色
            height: '40px',
            htmlContent: '' // 移除跑馬燈內容
          }
        };
        
        console.log('⚠️ useHeader: 使用 fallback 數據:', fallbackData);
        setHeaderData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  return { headerData, loading, error };
} 