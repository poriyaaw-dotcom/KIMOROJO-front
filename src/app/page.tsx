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
      .then(data => {
        console.log("✅ Categories fetched:", data);
        setCategories(data.data || []);
      })
      .catch(err => console.error("❌ Failed to fetch categories", err));
  }, []);

  return (
    <div className="bg-white">
      <HeroSection />
      <CollectionsGrid />
      <BannerSlider />
      
      <div className="relative z-10 bg-white">
        <div className="pt-20">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Loading categories...
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryRow 
                key={cat.id} 
                nameEn={cat.name_en}
                nameFa={cat.name_fa}
                slug={cat.slug} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Footer is NOT here - it's in layout.tsx */}
    </div>
  );
}