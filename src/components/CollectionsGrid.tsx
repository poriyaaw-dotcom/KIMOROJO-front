"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState, useRef } from 'react';
import { getSafeFirstImage } from '@/utils/imageHelper';

interface Collection {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
  image?: string | string[] | null;
}

export default function CollectionsGrid() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refs to track each collection card for the scroll observer
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);

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

  useEffect(() => {
    // STRICT RULE: Only apply this scroll effect on mobile to preserve desktop hover perfection
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const img = entry.target.querySelector('img');
          if (img) {
            if (entry.isIntersecting) {
              // When 40% of the card is visible on mobile, remove grayscale
              img.classList.remove('grayscale');
              img.classList.add('grayscale-0');
            } else {
              // When it scrolls out of view, put grayscale back
              img.classList.add('grayscale');
              img.classList.remove('grayscale-0');
            }
          }
        });
      },
      { threshold: 0.4 } // Triggers when 40% of the card is visible in the viewport
    );

    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [collections]);

  if (loading) {
    return (
      <section className="w-full px-6 md:px-12 xl:px-24 py-20" dir={isFarsi ? 'rtl' : 'ltr'}>
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
    <section className="w-full px-6 md:px-12 xl:px-24 py-20" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h2 className={`text-3xl md:text-4xl text-center mb-12 text-gray-900 ${isFarsi ? 'font-normal' : 'font-serif uppercase tracking-widest'}`}>
        {t('collections')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {collections.map((collection, index) => {
          const name = isFarsi ? collection.name_fa : collection.name_en;
          const image = getSafeFirstImage(collection.image) || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80";

          return (
            <Link 
              href={`/collections/${collection.slug}`} 
              key={collection.id}
              // Attach ref to track this specific card
              ref={(el) => { refs.current[index] = el; }}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
            >
              <img 
                src={image} 
                alt={name} 
                // Desktop keeps group-hover:grayscale-0. Mobile gets grayscale-0 via JS observer.
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