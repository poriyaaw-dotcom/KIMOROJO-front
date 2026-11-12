"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// MOBILE: Array of mobile-specific images
const mobileBanners = [
  { id: 1, image: "/images/slider-1-mobile.jpg" },
  { id: 2, image: "/images/slider-2-mobile.jpg" },
  { id: 3, image: "/images/slider-3-mobile.jpg" },
  { id: 4, image: "/images/slider-4-mobile.jpg" },
  { id: 5, image: "/images/slider-5-mobile.jpg" },
  { id: 6, image: "/images/slider-6-mobile.jpg" },
];

// DESKTOP: The MP4 file (Ensure this file exists in public/images/)
const desktopVideo = "/images/slider-desktop.mp4"; 

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === mobileBanners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? mobileBanners.length - 1 : prev - 1));

  return (
    <section className="relative w-full h-screen sticky top-0 z-0 bg-black group">
      
      {/* DESKTOP VIEW: Shows ONLY the MP4 Video */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        <Link href="/shop" className="block w-full h-full">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src={desktopVideo} type="video/mp4" />
            {/* Fallback if video fails to load */}
            Your browser does not support the video tag.
          </video>
        </Link>
      </div>

      {/* MOBILE VIEW: Shows the Image Slider */}
      <div className="block md:hidden relative w-full h-full">
        {mobileBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Link href="/shop" className="block w-full h-full">
              <img
                src={banner.image}
                alt={`Mobile Banner ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-700" 
              />
            </Link>
          </div>
        ))}
        
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

    </section>
  );
}