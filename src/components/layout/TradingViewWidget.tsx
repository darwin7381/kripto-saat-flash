"use client";

import { useEffect } from 'react';

interface TradingViewWidgetProps {
  className?: string;
}

export default function TradingViewWidget({ className = "" }: TradingViewWidgetProps) {
  
  useEffect(() => {
    // 確保 DOM 已經加載
    const initializeTradingView = () => {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

      const widgetScript = document.createElement('script');
      widgetScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      widgetScript.async = true;

      widgetScript.innerHTML = JSON.stringify({
        "symbols": [
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500 Endeksi" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
          { "proName": "FX_IDC:USDTRY", "title": "Dolar/TL" },
          { "proName": "FX_IDC:XAUTRYG", "title": "Altın" },
          { "proName": "COINBASE:SOLUSD", "title": "Solana" },
          { "proName": "COINBASE:DOGEUSD", "title": "Dogecoin" },
          { "proName": "COINBASE:XRPUSD", "title": "XRP" },
          { "proName": "COINBASE:SUIUSD", "title": "Sui" }
        ],
        "colorTheme": isDark ? "dark" : "light",
        "locale": "tr",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "displayMode": "regular"
      });

      const target = document.getElementById("tv-ticker-script-target");
      if (target) {
        // 清除之前的內容
        target.innerHTML = '';
        target.appendChild(widgetScript);
      }
    };

    // 短暫延遲確保組件已經完全掛載
    const timer = setTimeout(initializeTradingView, 100);

    return () => {
      clearTimeout(timer);
      const target = document.getElementById("tv-ticker-script-target");
      if (target) {
        target.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      id="tv-ticker-wrapper" 
      className={className}
      style={{ 
        width: '100%', 
        position: 'relative', 
        zIndex: 10, 
        margin: 0, 
        padding: 0 
      }}
    >
      <div className="tradingview-widget-container">
        <div 
          className="tradingview-widget-container__widget" 
          id="tv-ticker-script-target"
        ></div>
      </div>
    </div>
  );
} 