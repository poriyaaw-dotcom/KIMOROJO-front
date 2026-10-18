"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

interface Collection {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
  image?: string;
}

export default function CollectionsGrid() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 CollectionsGrid useEffect STARTED");
    fetch('http://127.0.0.1:8000/api/collections')
      .then((res) => {
        console.log("📡 Fetch response received, status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Data parsed:", data);
        setCollections(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch FAILED:", err);
        setLoading(false);
      });
  }, []);

  console.log("🔄 CollectionsGrid rendering, loading state is:", loading);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-gray-900 uppercase tracking-widest">
          {t('collections')}
        </h2>
        <div className="text-center text-gray-500">
          {isFarsi ? 'در حال بارگذاری...' : 'Loading collections...'}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-gray-900 uppercase tracking-widest">
        {t('collections')}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {collections.map((collection, index) => {
          const name = isFarsi ? collection.name_fa : collection.name_en;
          
          // FIX: Prepend the full storage URL to the image path
          const image = collection.image 
            ? `http://127.0.0.1:8000/storage/${collection.image}`
            : "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80";

          return (
            <Link 
              href={`/collections/${collection.slug}`} 
              key={collection.id}
              className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer"
            >
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 text-center transition-all duration-300 group-hover:bg-black/80">
                <span className="text-white font-serif text-sm md:text-base tracking-widest uppercase">
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