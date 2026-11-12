"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// MOBILE: Only mobile-specific images
const mobileBanners = [
  { id: 1, type: 'image', src: "/images/slider-1-mobile.jpg" },
  { id: 2, type: 'image', src: "/images/slider-2-mobile.jpg" },
  { id: 3, type: 'image', src: "/images/slider-3-mobile.jpg" },
  { id: 4, type: 'image', src: "/images/slider-4-mobile.jpg" },
  { id: 5, type: 'image', src: "/images/slider-5-mobile.jpg" },
  { id: 6, type: 'image', src: "/images/slider-6-mobile.jpg" },
];

// DESKTOP: Video FIRST, then the regular pictures
const desktopBanners = [
  { id: 100, type: 'video', src: "/images/slider-desktop.mp4" },
  { id: 1, type: 'image', src: "/images/slider-1.jpg" },
  { id: 2, type: 'image', src: "/images/slider-2.jpg" },
  // You can add slider-3.jpg, slider-4.jpg etc here if you want them on desktop too
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  // We use the desktop array length for desktop, mobile array length for mobile
  // But since we can't easily switch state logic on resize without complexity, 
  // we'll just use a long timer for video and short for images, or a standard timer.
  // Let's use a standard 6s timer. For video, it will just show the video for 6s then move on.
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        // We determine max length based on a simple check, but to keep it simple:
        // We will just cycle through the desktop array if on desktop, mobile if on mobile.
        // Since we can't easily do that in state without resize listeners, 
        // let's just make the array long enough or handle it in render.
        return prev; // We'll handle rotation in a simpler way below
      });
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  // Better approach: Just map the arrays directly and use CSS to show/hide
  // We need separate state for desktop and mobile to rotate independently
  
  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDesktopCurrent((prev) => (prev === desktopBanners.length - 1 ? 0 : prev + 1));
      setMobileCurrent((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen sticky top-0 z-0 bg-black group">
      
      {/* DESKTOP VIEW: Video + Pictures */}
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
      </div>

      {/* MOBILE VIEW: Only Mobile Images */}
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
        
        <button 
          onClick={() => setMobileCurrent((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button 
          onClick={() => setMobileCurrent((prev) => (prev === 0 ? mobileBanners.length - 1 : prev - 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

    </section>
  );
}