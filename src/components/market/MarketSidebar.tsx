"use client";

import React from 'react';
import Link from 'next/link';

interface MarketData {
  pair: string;
  exchange: string;
  price: string;
  usdt: string;
  change: string;
  isNegative: boolean;
}

export default function MarketSidebar() {
  // 模擬市場數據
  const marketData: MarketData[] = [
    { pair: "BTC/USDT", exchange: "binance", price: "¥22.03萬", usdt: "=32184.44 USDT", change: "-1.46%", isNegative: true },
    { pair: "ETH/USDT", exchange: "okex", price: "¥9117.71", usdt: "=1331.87 USDT", change: "-3.17%", isNegative: true },
    { pair: "XRP/USDT", exchange: "huobipro", price: "¥1.8079", usdt: "=0.2641 USDT", change: "-1.82%", isNegative: true },
    { pair: "BCH/USDT", exchange: "okex", price: "¥2879.75", usdt: "=420.66 USDT", change: "-2.73%", isNegative: true },
    { pair: "EOS/USDT", exchange: "okex", price: "¥17.80", usdt: "=2.6000 USDT", change: "-2.22%", isNegative: true },
  ];

  return (
    <div className="space-y-6">
      {/* Download App Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium">下載幣世界App</p>
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <div className="w-1 h-5 bg-blue-600 mr-3"></div>
            <h3 className="font-medium text-gray-900">行情</h3>
            <Link href="/market" className="ml-auto text-sm text-gray-500 hover:text-blue-600 transition-colors">
              更多 →
            </Link>
          </div>
        </div>
        
        {/* Market Table */}
        <div className="p-4">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-3 px-1">
            <span>交易對</span>
            <span className="text-right">價格</span>
            <span className="text-center">24H 漲跌幅</span>
          </div>
          
          {/* Market Items */}
          <div className="space-y-1">
            {marketData.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-3 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{item.pair}</div>
                  <div className="text-xs text-gray-500">{item.exchange}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 text-sm">{item.price}</div>
                  <div className="text-xs text-gray-500">{item.usdt}</div>
                </div>
                <div className="text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    item.isNegative 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white rounded-lg p-6 text-center shadow-sm">
        <div className="w-32 h-32 bg-gray-100 mx-auto mb-4 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm7-2h7v7h-7V3zm2 2v3h3V5h-3zM3 12h7v7H3v-7zm2 2v3h3v-3H5zm7-2h7v7h-7v-7zm2 2v3h3v-3h-3z"/>
            </svg>
            <span className="text-xs text-gray-500 mt-1 block">掃碼加群</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">官方QQ群號：776029071</p>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          點擊複製群號
        </button>
      </div>
    </div>
  );
} 