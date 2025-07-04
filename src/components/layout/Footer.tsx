import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-auto">
      {/* Disclaimer Bar */}
      <div className="bg-[#2D2D2D] py-3">
        <div className="max-w-[1200px] mx-auto px-[15px] text-center text-xs">
          免責聲明：幣世界作為開放的信息發布平台，所提供的所有資訊與幣世界觀點和立場無關，且不構成任何投資理財建議。望用戶仔細甄別，防範風險。
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="max-w-[1200px] mx-auto px-[15px] py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="bg-gray-800 rounded px-4 py-2 inline-block mb-4">
              <span className="text-white font-bold text-lg">幣世界</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              幣世界網-比特幣等數字貨幣交易所導航、投資理財、快訊、深度、幣圈、市場行情第一站。
            </p>
            <p className="text-xs text-gray-500">
              © 2021 幣世界 bishijie.com | 京ICP備17059629號-1 | 京公網安備 11010502034490號
            </p>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-gray-400 mb-4 font-medium">合作夥伴</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• Bitcoin</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• OKLink</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• 幣看</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• 火星財經</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• 鏈外網</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• 金果子</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• 波網boboo</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">• 比特幣減半</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="border border-gray-700 rounded-lg p-6">
              <h4 className="text-center text-gray-400 mb-6 pb-3 border-b border-gray-700">聯繫我們</h4>
              <div className="flex justify-around">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400">商務合作</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400">幣世界客服小妹</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-gray-400">新浪微博</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 