"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext'; // <-- ADDED

interface Category {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
}

interface Collection {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
}

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { cartCount } = useCart(); // <-- ADDED
  const router = useRouter();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isFarsi = lang === 'fa';
  
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setIsShopOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsShopOpen(false);
    }, 200);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/categories'),
          fetch('http://127.0.0.1:8000/api/collections')
        ]);
        const catData = await catRes.json();
        const colData = await colRes.json();
        setCategories(catData.data || []);
        setCollections(colData.data || []);
      } catch (error) {
        console.error("Failed to fetch menu data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 relative">
        <div className="grid grid-cols-2 h-full items-center">
          
          {/* LEFT: Search & Language */}
          <div className="flex items-center justify-start gap-4">
            <div className="relative w-48 hidden md:block">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="relative"
              >
                <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 ${isFarsi ? 'right-3' : 'left-3'}`} />
                <input 
                  type="text" 
                  dir={isFarsi ? 'rtl' : 'ltr'}
                  placeholder={t('searchPlaceholder')} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                    isFarsi ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'
                  }`}
                />
              </form>
            </div>
            <Search className="md:hidden text-gray-700 w-5 h-5" />

            <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
              <button 
                onClick={() => setLang('en')}
                className={`px-2 py-1 border rounded transition-colors ${lang === 'en' ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-100'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('fa')}
                className={`px-2 py-1 border rounded transition-colors ${lang === 'fa' ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-100'}`}
                style={{ fontFamily: 'var(--font-vazir)' }}
              >
                FA
              </button>
            </div>
          </div>

          {/* RIGHT: Nav & Icons */}
          <div className="flex items-center justify-end gap-6">
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/shop" className={`hover:text-black transition-colors py-2 ${isShopOpen ? 'text-black underline underline-offset-8 decoration-1' : ''}`}>
                  {t('shop')}
                </Link>
              </div>
              <Link href="/contact" className="hover:text-black transition-colors">{t('contact')}</Link>
              <Link href="/about" className="hover:text-black transition-colors">{t('about')}</Link>
            </nav>
            
            <div className="flex items-center gap-4 text-gray-700">
              {/* UPDATED CART ICON WITH BADGE */}
              <Link href="/cart" className="relative hover:text-black transition-colors" aria-label={t('cart')}>
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#682535] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link href="/favorites" className="hover:text-black transition-colors" aria-label={t('favorites')}>
                <Heart className="w-5 h-5" />
              </Link>
              <Link href="/account" className="hover:text-black transition-colors" aria-label={t('profile')}>
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* CENTER: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Link href="/" className="hover:opacity-80 transition-opacity block">
            <img 
              src="/images/logo.png" 
              alt="KIMOROJO" 
              className="h-[100px] w-auto object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Full-Width Mega Menu Dropdown */}
      <div 
        className={`absolute top-full left-0 right-0 w-full bg-white border-t border-gray-100 shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          isShopOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
        dir={isFarsi ? 'rtl' : 'ltr'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-serif text-sm uppercase tracking-widest text-[#682535] mb-4">
                {t('jewelry')}
              </h4>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/shop/${cat.slug}`} className="text-sm text-gray-600 hover:text-black transition-colors block">
                      {isFarsi ? cat.name_fa : cat.name_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm uppercase tracking-widest text-[#682535] mb-4">
                {t('collectionsHeading')}
              </h4>
              <ul className="space-y-3">
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link href={`/collections/${col.slug}`} className="text-sm text-gray-600 hover:text-black transition-colors block">
                      {isFarsi ? col.name_fa : col.name_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm uppercase tracking-widest text-[#682535] mb-4">
                {t('giftShop')}
              </h4>
              <ul className="space-y-3">
                <li><Link href="/gifts/all" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('allGifts')}</Link></li>
                <li><Link href="/gifts/charms" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('personalisedCharms')}</Link></li>
                <li><Link href="/gifts/zodiac" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('zodiacCollection')}</Link></li>
                <li><Link href="/gifts/personalised" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('personalisedJewelry')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}