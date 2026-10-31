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
    fetch('https://admin.kimorojo.ir/api/collections')
      .then((res) => res.json())
      .then((data) => {
        setCollections(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch collections", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20" dir={isFarsi ? 'rtl' : 'ltr'}>
        <h2 className={`text-3xl md:text-4xl text-center mb-12 text-gray-900 ${isFarsi ? 'font-normal' : 'font-serif uppercase tracking-widest'}`}>
          {t('collections')}
        </h2>
        <div className="text-center text-gray-500">
          {isFarsi ? 'در حال بارگذاری...' : 'Loading collections...'}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h2 className={`text-3xl md:text-4xl text-center mb-12 text-gray-900 ${isFarsi ? 'font-normal' : 'font-serif uppercase tracking-widest'}`}>
        {t('collections')}
      </h2>
      
      {/* CHANGED: Now strictly 1 column on mobile, 2 columns on desktop for bigger images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {collections.map((collection) => {
          const name = isFarsi ? collection.name_fa : collection.name_en;
          const image = collection.image 
            ? `https://admin.kimorojo.ir/storage/${collection.image}`
            : "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80";

          return (
            <Link 
              href={`/collections/${collection.slug}`} 
              key={collection.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
            >
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-4 text-center transition-all duration-300 group-hover:bg-black/80">
                <span 
                  className={`text-white text-xl md:text-2xl ${isFarsi ? 'font-normal' : 'font-serif tracking-widest'}`}
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