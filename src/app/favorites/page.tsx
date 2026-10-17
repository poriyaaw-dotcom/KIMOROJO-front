"use client";

import { useLang } from '@/context/LanguageContext';
import ProductGrid from '@/components/ProductGrid';
import { Heart } from 'lucide-react';
import Link from 'next/link';

// MOCK_DATA_START
const mockFavorites = [
  { id: 1, name: "Classic Gold Band", price: "$450", image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "Rings" },
  { id: 3, name: "Diamond Solitaire", price: "$1,200", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "Rings" },
];
// MOCK_DATA_END

export default function FavoritesPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';

  if (mockFavorites.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-serif text-gray-900 mb-4">{t('emptyFavorites')}</h1>
        <Link href="/shop/rings" className="inline-block bg-black text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors">
          {t('shop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">{t('favorites')}</h1>
      <ProductGrid products={mockFavorites} />
    </div>
  );
}