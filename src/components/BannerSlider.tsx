"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// MOBILE: Mobile-specific images
const mobileBanners = [
  { id: 1, type: 'image', src: "/images/slider-1-mobile.jpg" },
  { id: 2, type: 'image', src: "/images/slider-2-mobile.jpg" },
  { id: 3, type: 'image', src: "/images/slider-3-mobile.jpg" },
  { id: 4, type: 'image', src: "/images/slider-4-mobile.jpg" },
  { id: 5, type: 'image', src: "/images/slider-5-mobile.jpg" },
  { id: 6, type: 'image', src: "/images/slider-6-mobile.jpg" },
];

// DESKTOP: Video FIRST, then ONLY the pictures you have on the server (1 and 2)
const desktopBanners = [
  { id: 100, type: 'video', src: "/images/slider-desktop.mp4" },
  { id: 1, type: 'image', src: "/images/slider-1.jpg" },
  { id: 2, type: 'image', src: "/images/slider-2.jpg" },
];

export default function BannerSlider() {
  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDesktopCurrent((prev) => (prev === desktopBanners.length - 1 ? 0 : prev + 1));
      setMobileCurrent((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const nextDesktop = () => setDesktopCurrent((prev) => (prev === desktopBanners.length - 1 ? 0 : prev + 1));
  const prevDesktop = () => setDesktopCurrent((prev) => (prev === 0 ? desktopBanners.length - 1 : prev - 1));

  const nextMobile = () => setMobileCurrent((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1));
  const prevMobile = () => setMobileCurrent((prev) => (prev === 0 ? mobileBanners.length - 1 : prev - 1));

  return (
    <section className="relative w-full h-screen sticky top-0 z-0 bg-black group">
      
      {/* DESKTOP VIEW */}
      <div className="hidden md:block relative w-full h-full">
        {desktopBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === desktopCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Link href="/shop" className="block w-full h-full">
              {banner.type === 'video' ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                >
                  <source src={banner.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={banner.src}
                  alt={`Desktop Banner ${index + 1}`}
                  className="w-full h-full object-cover" 
                />
              )}
            </Link>
          </div>
        ))}
        
        {/* Desktop Arrows */}
        <button 
          onClick={prevDesktop}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full hover:bg-black/40"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        
        <button 
          onClick={nextDesktop}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full hover:bg-black/40"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden relative w-full h-full">
        {mobileBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === mobileCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Link href="/shop" className="block w-full h-full">
              <img
                src={banner.src}
                alt={`Mobile Banner ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-700" 
              />
            </Link>
          </div>
        ))}
        
        {/* Mobile Arrows */}
        <button 
          onClick={prevMobile}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button 
          onClick={nextMobile}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

    </section>
  );
}