"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
  image?: string | null; // <-- ADDED THIS
}

// Fallback image just in case a category doesn't have one yet
const fallbackImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80';

export default function CategoryGrid() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://https://api.kimorojo.com/api/categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-gray-500">{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</div>;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-8 text-center">
        {isFarsi ? 'دسته‌بندی‌ها' : 'Shop by Category'}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => {
          const name = isFarsi ? category.name_fa : category.name_en;
          
          // USES the uploaded image if it exists, otherwise uses the fallback
          const image = category.image 
            ? `http://https://api.kimorojo.com/storage/${category.image}`
            : fallbackImage;

          return (
            <Link 
              href={`/shop/${category.slug}`} 
              key={category.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm cursor-pointer"
            >
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-4 text-center transition-all duration-300 group-hover:bg-black/80">
                <span 
                  className={`text-white text-lg ${isFarsi ? 'font-normal' : 'font-serif tracking-widest'}`}
                  style={{ textTransform: isFarsi ? 'none' : 'uppercase' }}
                >
                  {name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}