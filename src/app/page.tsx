"use client";

import HeroSection from "@/components/HeroSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import BannerSlider from "@/components/BannerSlider";
import CategoryRow from "@/components/CategoryRow";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  return (
    <div className="bg-white">
      <HeroSection />
      <CollectionsGrid />
      
      {/* Sticky Banner stays at z-0 */}
      <BannerSlider />
      
      {/* This wrapper ensures everything below the banner slides OVER it with a solid white background */}
      <div className="relative z-10 bg-white">
        
        <div className="pt-20">
          {categories.map((cat) => (
            <CategoryRow 
              key={cat.id} 
              nameEn={cat.name_en}
              nameFa={cat.name_fa}
              slug={cat.slug} 
            />
          ))}
        </div>

        {/* Footer removed from here because it is already in layout.tsx */}
        
      </div>
    </div>
  );
}