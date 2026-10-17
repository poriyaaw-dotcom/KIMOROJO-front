"use client"; // <--- THIS MUST BE THE VERY FIRST LINE

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

// MOCK_DATA_START: Replace this array with data fetched from the backend API
const mockProducts = [
  { id: 1, name: "Gold Band", price: "$450", image: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Silver Ring", price: "$120", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Diamond Solitaire", price: "$1,200", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Rose Gold Ring", price: "$350", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Platinum Band", price: "$800", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80" },
];
// MOCK_DATA_END

export default function CategoryRow({ titleKey, category }: { titleKey: string, category: string }) {
  const { lang, t } = useLang();
  const isFarsi = lang === 'fa';

  return (
    <section dir={isFarsi ? 'rtl' : 'ltr'} className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900">{t(titleKey)}</h2>
        <Link href={`/shop/${category}`} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
          {t('viewAll')} 
          <ArrowRight className={`w-4 h-4 transition-transform ${isFarsi ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {mockProducts.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="flex-shrink-0 w-64 group cursor-pointer">
            <div className="aspect-square overflow-hidden bg-gray-100 mb-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{product.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}