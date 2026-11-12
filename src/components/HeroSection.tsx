"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';

export default function HeroSection() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';

  const heroImage = "/images/hero-cover.png";

  return (
    <section className="relative w-full h-[80vh] overflow-hidden group">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={heroImage} 
          alt="Premium Jewelry Hero" 
          className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/25 transition-all duration-700" />
      </div>

      {/* CHANGED: items-center keeps the block in the middle of the screen */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center px-6" 
        dir={isFarsi ? 'rtl' : 'ltr'}
      >
        {/* CHANGED: This inner div centers the block but aligns text to the start (right for Farsi) */}
        <div className="w-full max-w-4xl text-start">
          <h1 
            className={`text-white text-4xl md:text-6xl mb-4 ${
              isFarsi ? 'font-bold' : 'font-serif tracking-[0.15em] uppercase'
            }`}
          >
            {isFarsi ? 'هر قطعه، راوی قصه ای ناگفته.' : 'Handcrafted For Every Moment'}
          </h1>
          
          <p className="text-white/80 text-sm md:text-base mb-10 leading-relaxed">
            {isFarsi 
              ? 'تجربه‌ای زیسته و رویایی که به حقیقت پیوسته. طراحی اصیل، ساخت دقیق و جزئیاتی که از آنِ توست.' 
              : 'An exquisite collection of handcrafted gold and silver, or entrust us with your own idea.'}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link 
              href="/shop" 
              className={`bg-white text-gray-900 px-10 py-4 text-sm font-medium hover:bg-gray-100 transition-colors ${
                isFarsi ? '' : 'tracking-widest uppercase'
              }`}
            >
              {isFarsi ? 'مشاهده فروشگاه' : 'Shop Collection'}
            </Link>
            
            <Link 
              href="/custom-order" 
              className={`border border-white text-white px-10 py-4 text-sm font-medium hover:bg-[#682535] hover:border-[#682535] transition-colors ${
                isFarsi ? '' : 'tracking-widest uppercase'
              }`}
            >
              {isFarsi ? 'سفارش اختصاصی' : 'Custom Order'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}