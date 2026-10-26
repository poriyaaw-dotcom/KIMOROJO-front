"use client";

import { useState, useEffect } from 'react';
import { useLang } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  metal_type: string;
  making_charges: number;
  images: string[] | null;
  collection: { slug: string; name_en: string; name_fa: string } | null;
}

interface Collection {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
  image: string | null;
}

export default function CollectionClient({ 
  initialProducts, 
  collection 
}: { 
  initialProducts: Product[]; 
  collection: Collection;
}) {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  
  const [products] = useState<Product[]>(initialProducts);

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const GOLD_PRICE_PER_GRAM_TOMAN = 4500000;
  const getProductPrice = (product: Product) => {
    return (GOLD_PRICE_PER_GRAM_TOMAN * product.weight) + product.making_charges;
  };

  const collectionName = isFarsi ? collection.name_fa : collection.name_en;
  const collectionImage = collection.image ? `http://127.0.0.1:8000/storage/${collection.image}` : null;

  return (
    <div dir={isFarsi ? 'rtl' : 'ltr'}>
      {/* Collection Hero Banner */}
      <section className="relative w-full h-[50vh] overflow-hidden bg-gray-100">
        {collectionImage && (
          <img 
            src={collectionImage} 
            alt={collectionName} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white text-center tracking-widest uppercase">
            {collectionName}
          </h1>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {isFarsi ? 'محصولی در این مجموعه یافت نشد.' : 'No products found in this collection yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {products.map((product) => {
              const itemName = isFarsi ? product.name_fa : product.name_en;
              const price = getProductPrice(product);
              
              const mainImage = product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0]}` : null;
              const hoverImage = product.images && product.images.length > 1 ? `http://127.0.0.1:8000/storage/${product.images[1]}` : null;
              
              return (
                <ProductCard 
                  key={product.id} 
                  id={product.id} 
                  name={itemName} 
                  price={formatToman(price)} 
                  image={mainImage || ''} 
                  hoverImage={hoverImage || undefined}
                  category={product.collection?.slug || ''} 
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}