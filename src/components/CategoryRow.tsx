"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

const GOLD_PRICE_PER_GRAM_TOMAN = 4500000; 

interface CategoryRowProps {
  nameEn: string;
  nameFa: string;
  slug: string;
}

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  making_charges: number;
  images: string[] | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
}

export default function CategoryRow({ nameEn, nameFa, slug }: CategoryRowProps) {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamically choose the title based on language
  const title = isFarsi ? nameFa : nameEn;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];
        
        const filtered = allProducts.filter((p: Product) => p.category?.slug === slug);
        setProducts(filtered);
      } catch (error) {
        console.error(`Failed to fetch products for ${slug}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-500">Loading {title}...</div>;
  }

  if (products.length === 0) {
    return null; 
  }

  return (
    // dir="rtl" automatically flips the flex layout (Title on right, View All on left)
    <section className="py-12 px-6 max-w-7xl mx-auto" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      {/* Header with Title and View All Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
          {title}
        </h2>
        <Link href={`/shop/${slug}`} className="text-sm font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-wider">
          {t('viewAll')}
        </Link>
      </div>

      {/* Horizontal Slider Container with Elegant Scrollbar */}
      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 elegant-scrollbar">
          {products.map((product) => {
            const itemName = isFarsi ? product.name_fa : product.name_en;
            const itemPrice = (GOLD_PRICE_PER_GRAM_TOMAN * product.weight) + product.making_charges;
            
            const itemImage = product.images && product.images.length > 0 
              ? `http://127.0.0.1:8000/storage/${product.images[0]}`
              : 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80';

            return (
              <Link 
                href={`/product/${product.id}`} 
                key={product.id} 
                className="group flex-shrink-0 w-[280px] snap-center"
              >
                {/* Image - Grayscale to color on hover */}
                <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                </div>
                
                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">
                    {itemName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.purity} | {product.weight}g
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    {formatToman(itemPrice)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}