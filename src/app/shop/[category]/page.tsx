"use client";

import { use, useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';
import { ChevronDown } from 'lucide-react';

// MOCK_DATA_START: Replace with API fetch based on category param
const mockProducts = [
  { id: 1, name: "Classic Gold Band", price: "$450", image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 2, name: "Silver Twist Ring", price: "$120", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 3, name: "Diamond Solitaire", price: "$1,200", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 4, name: "Rose Gold Band", price: "$350", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 5, name: "Platinum Eternity", price: "$800", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 6, name: "Minimalist Gold Ring", price: "$220", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 7, name: "Vintage Gold Ring", price: "$550", image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 8, name: "Silver Stack Ring", price: "$95", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 9, name: "Emerald Cut Ring", price: "$1,500", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 10, name: "Rose Gold Twist", price: "$380", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 11, name: "Silver Band Classic", price: "$140", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 12, name: "Gold Signet Ring", price: "$620", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 13, name: "Diamond Eternity Band", price: "$2,100", image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 14, name: "Silver Celtic Ring", price: "$175", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 15, name: "Ruby Gold Ring", price: "$1,800", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 16, name: "Rose Gold Halo", price: "$420", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 17, name: "Silver Promise Ring", price: "$110", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 18, name: "Gold Infinity Ring", price: "$490", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 19, name: "Gold Wedding Band", price: "$680", image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 20, name: "Silver Stackable Ring", price: "$130", image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 21, name: "Diamond Accent Ring", price: "$950", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 22, name: "Rose Gold Band", price: "$410", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
  { id: 23, name: "Silver Eternity Ring", price: "$165", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "silver" },
  { id: 24, name: "Gold Cocktail Ring", price: "$720", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=400&q=80", hoverImage: "https://images.unsplash.com/photo-1617038224558-28309a917c9b?auto=format&fit=crop&w=400&q=80", category: "rings", metal: "gold" },
];
// MOCK_DATA_END

export default function ShopPage({ params }: { params: Promise<{ category: string }> }) {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const { category } = use(params);
  
  const [sortBy, setSortBy] = useState('recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMetal, setFilterMetal] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  // Filter products
  const filteredProducts = mockProducts.filter(product => {
    const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
    const metalMatch = filterMetal === 'all' || product.metal === filterMetal;
    return categoryMatch && metalMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/[$,]/g, ''));
    const priceB = parseFloat(b.price.replace(/[$,]/g, ''));
    if (sortBy === 'priceLowHigh') return priceA - priceB;
    if (sortBy === 'priceHighLow') return priceB - priceA;
    if (sortBy === 'newest') return b.id - a.id;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const sortOptions = [
    { value: 'recommended', label: t('recommended') },
    { value: 'newest', label: t('newest') },
    { value: 'priceLowHigh', label: t('priceLowHigh') },
    { value: 'priceHighLow', label: t('priceHighLow') },
  ];

  const categoryOptions = [
    { value: 'all', label: t('allCategories') },
    { value: 'rings', label: t('rings') },
    { value: 'necklaces', label: t('necklaces') },
    { value: 'bracelets', label: t('bracelets') },
    { value: 'earrings', label: t('earrings') },
  ];

  const metalOptions = [
    { value: 'all', label: t('allMetals') },
    { value: 'gold', label: t('gold') },
    { value: 'silver', label: t('silver') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">{t(category) || categoryTitle}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            
            {/* Sort By Dropdown */}
            <div>
              <h3 className="font-serif text-lg text-black mb-4">{t('sortBy')}</h3>
              <div className="relative">
                <button 
                  onClick={() => setSortOpen(!sortOpen)}
                  className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-sm text-sm text-gray-700 hover:border-gray-400 transition-colors"
                >
                  <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <div className={`absolute top-full ${isFarsi ? 'right-0' : 'left-0'} mt-1 w-full bg-white border border-gray-200 shadow-lg z-20`}>
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setSortOpen(false); setCurrentPage(1); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                        } ${isFarsi ? 'text-right' : ''}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="font-serif text-lg text-black mb-4">{t('categories')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {categoryOptions.map((option) => (
                  <li 
                    key={option.value}
                    onClick={() => { setFilterCategory(option.value); setCurrentPage(1); }}
                    className={`cursor-pointer hover:text-black transition-colors ${
                      filterCategory === option.value ? 'text-black font-medium' : ''
                    }`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Metal Type Filter */}
            <div>
              <h3 className="font-serif text-lg text-black mb-4">{t('metalType')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {metalOptions.map((option) => (
                  <li 
                    key={option.value}
                    onClick={() => { setFilterMetal(option.value); setCurrentPage(1); }}
                    className={`cursor-pointer hover:text-black transition-colors flex items-center gap-2 ${
                      filterMetal === option.value ? 'text-black font-medium' : ''
                    }`}
                  >
                    {option.value === 'gold' && <span className="w-3 h-3 rounded-full bg-yellow-400 border border-gray-300"></span>}
                    {option.value === 'silver' && <span className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400"></span>}
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {paginatedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name} 
                price={product.price} 
                image={product.image} 
                hoverImage={product.hoverImage}
                category={product.category} 
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-16">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                {/* Added rtl:rotate-180 to flip the arrow in Farsi */}
                <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                {/* Added rtl:rotate-180 to flip the arrow in Farsi */}
                <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}