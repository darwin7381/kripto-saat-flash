import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer-holder bg-[#1c1c1c]" id="footer">
      <div className="jeg_footer jeg_footer_1 dark">
        <div className="jeg_footer_container jeg_container">
          <div className="jeg_footer_content">
            <div className="container max-w-[1200px] mx-auto px-[15px]">
              <div className="row">
                
                {/* Primary Footer Section */}
                <div className="jeg_footer_primary clearfix" style={{ padding: '60px 0px 40px' }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
                    
                    {/* Column 1: Logo + Description */}
                    <div className="col-md-4 footer_column" style={{ padding: '0px 15px' }}>
                      <div className="footer_widget widget_jnews_about mb-6">
                        <div className="jeg_about">
                          <Link href="https://kriptosaat.com/" className="footer_logo inline-block mb-4">
                            <Image
                              src="https://kriptosaat.com/wp-content/uploads/2025/06/5eca877f1b-1.png"
                              alt="Kripto_Saat_White"
                              width={136}
                              height={47}
                              className="h-auto"
                            />
                          </Link>
                          <p></p>
                        </div>
                      </div>
                      
                      <div className="widget_text footer_widget widget_custom_html">
                        <div className="textwidget custom-html-widget text-[#a8a8aa] text-sm leading-[22.4px]">
                          Biz, kripto para dünyasından anlık haberler, derin analizler ve pratik rehber içerikleri sunuyoruz. Bitcoin&apos;den altcoin&apos;lere kadar piyasadaki tüm gelişmeleri tarafsız ve güncel şekilde takip edebilirsiniz.
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 2: Recent News */}
                    <div className="col-md-4 footer_column" style={{ padding: '0px 15px' }}>
                      <div className="footer_widget widget_recent_entries">
                        <div className="jeg_footer_heading jeg_footer_heading_1">
                          <h3 className="jeg_footer_title text-[#f93d53] text-base font-bold mb-5">
                            <span>Recent News</span>
                          </h3>
                        </div>
                        <ul className="space-y-4">
                          <li>
                            <Link 
                              href="https://kriptosaat.com/blokzincirdeki-blok-nedir/"
                              className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors text-sm leading-relaxed block"
                            >
                              Blokzincirdeki &apos;Blok&apos; Nedir?
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="https://kriptosaat.com/yeni-baslayanlar-icin-kripto-para-satin-alma-rehberi/"
                              className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors text-sm leading-relaxed block"
                            >
                              Yeni Başlayanlar İçin Adım Adım Kripto Para Satın Alma Rehberi
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="https://kriptosaat.com/proof-of-work-vs-proof-of-stake-karsilastirma/"
                              className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors text-sm leading-relaxed block"
                            >
                              Proof of Work (PoW) ve Proof of Stake (PoS)
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    {/* Column 3: Categories */}
                    <div className="col-md-4 footer_column" style={{ padding: '0px 15px' }}>
                      <div className="footer_widget widget_categories">
                        <div className="jeg_footer_heading jeg_footer_heading_1">
                          <h3 className="jeg_footer_title text-[#f93d53] text-base font-bold mb-5">
                            <span>Category</span>
                          </h3>
                        </div>
                        {/* 響應式多列佈局 - 桌面版 3 列，手機版 2 列 */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-sm">
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_business/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Business
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_news/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            News
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_sports/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Sports
                          </Link>
                          
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_culture/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Culture
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_opinion/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Opinion
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_travel/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Travel
                          </Link>
                          
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_lifestyle/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Lifestyle
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_politics/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Politics
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_world/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            World
                          </Link>
                          
                          <Link 
                            href="https://kriptosaat.com/category/jnews_demo_national/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            National
                          </Link>
                          <Link 
                            href="https://kriptosaat.com/category/rehberler/"
                            className="text-[rgba(255,255,255,0.8)] hover:text-white transition-colors"
                          >
                            Rehberler
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 分隔線 - 在 secondary footer 前面 */}
                <div className="border-t border-[#333]"></div>
                
                {/* Secondary Footer Section */}
                <div className="jeg_footer_secondary clearfix" style={{ padding: '30px 0px 40px' }}>
                  <div className="footer_right">
                    {/* Empty as in original */}
                  </div>
                  
                  <p className="copyright text-[#d1d1d1] text-sm text-left">
                    © 2025 Kriptosaat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 