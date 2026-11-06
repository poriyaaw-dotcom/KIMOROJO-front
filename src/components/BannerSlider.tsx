"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// All 6 banner images from public folder
const banners = [
  { id: 1, image: "/images/slider-1.png" },
  { id: 2, image: "/images/slider-2.png" },
  { id: 3, image: "/images/slider-3.png" },
  { id: 4, image: "/images/slider-4.png" },
  { id: 5, image: "/images/slider-5.png" },
  { id: 6, image: "/images/slider-6.png" },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <section className="relative w-full h-screen sticky top-0 z-0 bg-black group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Link href="/shop" className="block w-full h-full">
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover transition-all duration-700" 
            />
          </Link>
        </div>
      ))}
      
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
      >
        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-2"
      >
        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
      </button>
    </section>
  );
}