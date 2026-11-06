"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Collection {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
  image?: string | string[] | null;
}

const fallbackImage = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80';

// Helper to safely get the first image
const getSafeFirstImage = (image: string | string[] | null | undefined): string => {
  if (!image) return fallbackImage;
  if (Array.isArray(image)) return image[0] || fallbackImage;
  return image || fallbackImage;
};

export default function CollectionsGrid() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch('https://admin.kimorojo.ir/api/collections');
        const data = await res.json();
        setCollections(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</div>;
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    // FIXED: Replaced max-w-7xl mx-auto with w-full and responsive padding
    <section className="w-full px-6 md:px-12 xl:px-24 py-20" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-12 text-center">
        {isFarsi ? 'مجموعه‌های ما' : 'Our Collections'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection) => {
          const name = isFarsi ? collection.name_fa : collection.name_en;
          const image = getSafeFirstImage(collection.image);

          return (
            <Link 
              href={`/collections/${collection.slug}`} 
              key={collection.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm cursor-pointer"
            >
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <span 
                  className={`text-white text-xl ${isFarsi ? 'font-normal' : 'font-serif tracking-widest'}`}
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