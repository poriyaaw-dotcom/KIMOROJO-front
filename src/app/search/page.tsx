"use client";

import { useLang } from '@/context/LanguageContext';
import ProductGrid from '@/components/ProductGrid';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// MOCK_DATA_START
const allProducts = [
  { id: 1, name: "Classic Gold Band", price: "$450", image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "Rings" },
  { id: 2, name: "Silver Twist Ring", price: "$120", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "Rings" },
  { id: 3, name: "Diamond Solitaire", price: "$1,200", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "Rings" },
];
// MOCK_DATA_END

function SearchContent() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 text-center">
        {t('searchResults')} "{query}"
      </h1>
      
      {results.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">{t('noResults')}</p>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}