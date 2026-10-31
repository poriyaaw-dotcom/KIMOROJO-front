"use client";

import { useState, useEffect } from 'react';
import { useLang } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { ChevronDown } from 'lucide-react';
import { calculateProductPrice } from '@/utils/calculatePrice';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number | string;
  purity: string;
  metal_type: string;
  making_charges: number | string;
  accessories_price?: number | string;
  accessories_making_charges?: number | string;
  accessories_profit?: number | string;
  apply_tax_on_accessories?: boolean | number;
  images: string[] | string | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
}

interface Category {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
}

// Safe image parsing helper
const parseImages = (img: any): string[] => {
  if (!img) return [];
  if (Array.isArray(img)) return img;
  try { return JSON.parse(img); } catch { return typeof img === 'string' ? [img] : []; }
};

export default function ShopClient({ 
  initialProducts, 
  initialCategories, 
  initialCategorySlug 
}: { 
  initialProducts: Product[]; 
  initialCategories: Category[]; 
  initialCategorySlug: string;
}) {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [settings, setSettings] = useState<any>(null);
  
  const [sortBy, setSortBy] = useState('recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState(initialCategorySlug);
  const [filterMetal, setFilterMetal] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetch('https://admin.kimorojo.ir/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data.data || data))
      .catch(err => console.error("Failed to fetch settings", err));
  }, []);

  useEffect(() => {
    setFilterCategory(initialCategorySlug);
    setCurrentPage(1);
  }, [initialCategorySlug]);

  const filteredProducts = products.filter(product => {
    const categoryMatch = filterCategory === 'all' || product.category?.slug === filterCategory;
    const metal = product.metal_type || 'gold';
    const metalMatch = filterMetal === 'all' || metal === filterMetal;
    return categoryMatch && metalMatch;
  });

  const getProductPrice = (product: Product) => {
    return calculateProductPrice(product, settings || undefined);
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = getProductPrice(a);
    const priceB = getProductPrice(b);
    if (sortBy === 'priceLowHigh') return priceA - priceB;
    if (sortBy === 'priceHighLow') return priceB - priceA;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const sortOptions = [
    { value: 'recommended', label: t('recommended') || 'Recommended' },
    { value: 'newest', label: t('newest') || 'Newest' },
    { value: 'priceLowHigh', label: t('priceLowHigh') || 'Price: Low to High' },
    { value: 'priceHighLow', label: t('priceHighLow') || 'Price: High to Low' },
  ];

  const metalOptions = [
    { value: 'all', label: t('allMetals') || 'All Metals' },
    { value: 'gold', label: t('gold') || 'Gold' },
    { value: 'silver', label: t('silver') || 'Silver' },
  ];

  const currentCategoryName = categories.find(c => c.slug === filterCategory)?.[isFarsi ? 'name_fa' : 'name_en'] || (filterCategory === 'all' ? (t('allCategories') || 'All Categories') : filterCategory);

  const firstProduct = paginatedProducts[0];
  const debugPrice = firstProduct ? getProductPrice(firstProduct) : 0;

  return (
    <>
      <div style={{ position: 'fixed', top: 10, left: 10, background: 'red', color: 'white', padding: '15px', zIndex: 9999, fontSize: '14px', fontFamily: 'monospace', borderRadius: '8px', direction: 'ltr' }}>
        <div><strong>SETTINGS:</strong> {JSON.stringify(settings)}</div>
        <div><strong>1st Product Weight:</strong> {firstProduct?.weight}</div>
        <div><strong>1st Product Making:</strong> {firstProduct?.making_charges}</div>
        <div><strong>1st Product Acc. Price:</strong> {firstProduct?.accessories_price}</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">{currentCategoryName}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="font-serif text-lg text-black mb-4">{t('sortBy') || 'Sort By'}</h3>
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)} className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-sm text-sm text-gray-700 hover:border-gray-400 transition-colors">
                    <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortOpen && (
                    <div className={`absolute top-full ${isFarsi ? 'right-0' : 'left-0'} mt-1 w-full bg-white border border-gray-200 shadow-lg z-20`}>
                      {sortOptions.map((option) => (
                        <button key={option.value} onClick={() => { setSortBy(option.value); setSortOpen(false); setCurrentPage(1); }} className={`w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === option.value ? 'bg-gray-100 font-medium' : ''} ${isFarsi ? 'text-right' : 'text-left'}`}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg text-black mb-4">{t('categories') || 'Categories'}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li onClick={() => { setFilterCategory('all'); setCurrentPage(1); }} className={`cursor-pointer hover:text-black transition-colors ${filterCategory === 'all' ? 'text-black font-medium' : ''}`}>
                    {t('allCategories') || 'All Categories'}
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id} onClick={() => { setFilterCategory(cat.slug); setCurrentPage(1); }} className={`cursor-pointer hover:text-black transition-colors ${filterCategory === cat.slug ? 'text-black font-medium' : ''}`}>
                      {isFarsi ? cat.name_fa : cat.name_en}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-lg text-black mb-4">{t('metalType') || 'Metal Type'}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {metalOptions.map((option) => (
                    <li key={option.value} onClick={() => { setFilterMetal(option.value); setCurrentPage(1); }} className={`cursor-pointer hover:text-black transition-colors flex items-center gap-2 ${filterMetal === option.value ? 'text-black font-medium' : ''}`}>
                      {option.value === 'gold' && <span className="w-3 h-3 rounded-full bg-yellow-400 border border-gray-300"></span>}
                      {option.value === 'silver' && <span className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400"></span>}
                      {option.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="flex-grow">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                {isFarsi ? 'محصولی در این دسته‌بندی یافت نشد.' : 'No products found matching your filters.'}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                  {paginatedProducts.map((product) => {
                    const itemName = isFarsi ? product.name_fa : product.name_en;
                    const price = getProductPrice(product);
                    
                    // SAFE IMAGE PARSING
                    const parsedImages = parseImages(product.images);
                    const mainImage = parsedImages.length > 0 ? `https://admin.kimorojo.ir/storage/${parsedImages[0]}` : null;
                    const hoverImage = parsedImages.length > 1 ? `https://admin.kimorojo.ir/storage/${parsedImages[1]}` : null;
                    
                    return (
                      <ProductCard 
                        key={product.id} 
                        id={product.id} 
                        name={itemName} 
                        price={formatToman(price)} 
                        image={mainImage || ''} 
                        hoverImage={hoverImage || undefined}
                        category={product.category?.slug || ''} 
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-6 mt-16">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-sm text-gray-600 font-medium">{currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}