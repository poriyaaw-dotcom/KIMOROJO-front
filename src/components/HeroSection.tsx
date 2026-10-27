"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';

export default function HeroSection() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';

  // TODO: Later, this can be fetched from a Laravel "Settings" or "Banners" API endpoint
  const heroImage = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop";

  return (
    <section className="relative w-full h-[80vh] overflow-hidden group">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={heroImage} 
          alt="Premium Jewelry Hero" 
          // Fully colorful all the time, with a subtle zoom on hover
          className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        {/* Constant soft overlay so the text stays readable even on hover */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/25 transition-all duration-700" />
      </div>

      {/* Hero Content */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" 
        dir={isFarsi ? 'rtl' : 'ltr'}
      >
        <h1 
          className={`text-white text-4xl md:text-6xl mb-4 ${
            isFarsi ? 'font-bold' : 'font-serif tracking-[0.15em] uppercase'
          }`}
        >
          {isFarsi ? 'جواهرات دست‌ساز، برای هر لحظه' : 'Handcrafted For Every Moment'}
        </h1>
        
        <p className="text-white/80 text-sm md:text-base mb-10 max-w-xl">
          {isFarsi 
            ? 'مجموعه‌ای بی‌نظیر از طلا و نقره دست‌ساز، یا ایده خود را به ما بسپارید.' 
            : 'An exquisite collection of handcrafted gold and silver, or entrust us with your own idea.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
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
    </section>
  );
}