"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { calculateProductPrice } from '@/utils/calculatePrice';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  metal_type: string;
  making_charges: number;
  accessories_price?: number;
  accessories_making_charges?: number;
  accessories_profit?: number;
  apply_tax_on_accessories?: boolean;
  images: string[] | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
}

export default function NewInSlider() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, settingsRes] = await Promise.all([
          fetch('http://https://api.kimorojo.com/api/products'),
          fetch('http://https://api.kimorojo.com/api/settings')
        ]);
        const prodData = await prodRes.json();
        const settingsData = await settingsRes.json();
        
        setSettings(settingsData.data || settingsData);
        
        const allProducts = prodData.data || [];
        const newestProducts = allProducts
          .sort((a: Product, b: Product) => b.id - a.id)
          .slice(0, 8);
          
        setProducts(newestProducts);
      } catch (error) {
        console.error("Failed to fetch new in products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getItemPrice = (product: Product) => {
    if (!settings) return 0;
    return calculateProductPrice(product, settings);
  };

  if (loading) {
    return <div className="py-12 text-center text-gray-500">{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</div>;
  }

  if (products.length === 0) return null; 

  const title = isFarsi ? 'تازه‌های فروشگاه' : 'New In';

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto" dir={isFarsi ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif text-gray-900">{title}</h2>
        <Link href={`/shop`} className="text-sm font-medium text-gray-500 hover:text-black transition-colors uppercase tracking-wider">
          {t('viewAll')}
        </Link>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 elegant-scrollbar">
          {products.map((product) => {
            const itemName = isFarsi ? product.name_fa : product.name_en;
            const itemPrice = getItemPrice(product);
            const itemImage = product.images && product.images.length > 0 
              ? `http://https://api.kimorojo.com/storage/${product.images[0]}`
              : 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80';

            return (
              <Link href={`/product/${product.id}`} key={product.id} className="group flex-shrink-0 w-[280px] snap-center">
                <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden mb-4">
                  <img src={itemImage} alt={itemName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">{itemName}</h3>
                  <p className="text-sm text-gray-500">{product.purity} | {product.weight}g</p>
                  <p className="text-sm font-medium text-gray-900 mt-2">{formatToman(itemPrice)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}