"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const GOLD_PRICE_PER_GRAM_TOMAN = 4500000;

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  metal_type: string;
  making_charges: number;
  images: string[] | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];
        
        // Filter products by name (English or Persian)
        const filtered = allProducts.filter((p: Product) => 
          p.name_en.toLowerCase().includes(query.toLowerCase()) || 
          p.name_fa.includes(query)
        );
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getProductPrice = (product: Product) => {
    return (GOLD_PRICE_PER_GRAM_TOMAN * product.weight) + product.making_charges;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-serif text-gray-900 mb-8">
        {t('searchResults') || 'Search Results'}: <span className="text-[#682535]">"{query}"</span>
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {t('noResults') || 'No products found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product) => {
            const itemName = isFarsi ? product.name_fa : product.name_en;
            const price = getProductPrice(product);
            const mainImage = product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0]}` : '';
            
            return (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={itemName} 
                price={formatToman(price)} 
                image={mainImage} 
                category={product.category?.slug || ''} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}