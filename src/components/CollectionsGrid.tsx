"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';

// MOCK_DATA_START: Replace this array with collections fetched from the backend API
const collections = [
  { name: "Bridal", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80" },
  { name: "Everyday", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
  { name: "Vintage", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80" },
  { name: "Minimalist", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=600&q=80" },
  { name: "Gemstone", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=600&q=80" },
  { name: "Men's", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80" },
  { name: "Luxury", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80" },
  { name: "Gifts", image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=600&q=80" },
];
// MOCK_DATA_END

export default function CollectionsGrid() {
  const { t } = useLang();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-gray-900 uppercase tracking-widest">
        {t('collections')}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {collections.map((collection, index) => (
          <Link 
            href={`/collections/${collection.name.toLowerCase()}`} 
            key={index}
            className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer"
          >
            <img 
              src={collection.image} 
              alt={collection.name} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 text-center transition-all duration-300 group-hover:bg-black/80">
              <span className="text-white font-serif text-sm md:text-base tracking-widest uppercase">
                {collection.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}