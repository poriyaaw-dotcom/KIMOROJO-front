"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Search, ShoppingBag, Heart, User } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const isFarsi = lang === 'fa';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          
          {/* LEFT: Search & Language */}
          <div className="flex items-center justify-start gap-4">
            <div className="relative w-48 hidden md:block">
              <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 ${isFarsi ? 'right-3' : 'left-3'}`} />
              <input 
                type="text" 
                dir={isFarsi ? 'rtl' : 'ltr'}
                placeholder={t('searchPlaceholder')} 
                className={`w-full py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all ${
                  isFarsi ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'
                }`}
              />
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

          {/* CENTER: Logo */}
          <div className="flex justify-center">
            <Link href="/" className="text-xl md:text-2xl font-serif tracking-[0.25em] text-black uppercase hover:opacity-80 transition-opacity">
              KIMOROJO
            </Link>
          </div>

          {/* RIGHT: Nav & Icons */}
          <div className="flex items-center justify-end gap-6">
            <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
              
              {/* SHOP - Full Width Mega Menu Trigger */}
              <div 
                className="relative"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <button className={`hover:text-black transition-colors py-2 ${isShopOpen ? 'text-black underline underline-offset-8 decoration-1' : ''}`}>
                  {t('shop')}
                </button>
              </div>

              <Link href="/contact" className="hover:text-black transition-colors">{t('contact')}</Link>
              <Link href="/about" className="hover:text-black transition-colors">{t('about')}</Link>
            </nav>
            
            <div className="flex items-center gap-4 text-gray-700">
              <Link href="/cart" className="hover:text-black transition-colors" aria-label={t('cart')}>
                <ShoppingBag className="w-5 h-5" />
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
      </div>

      {/* Full-Width Mega Menu Dropdown - Slides down from the entire header */}
      <div 
        className={`absolute top-full left-0 right-0 w-full bg-white border-t border-gray-100 shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          isShopOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        }`}
        dir={isFarsi ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Changed from 5 columns to 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: JEWELLERY */}
            <div>
              <h4 className="font-serif text-sm uppercase tracking-widest text-[#b87333] mb-4">
                {t('jewelry')}
              </h4>
              <ul className="space-y-3">
                <li><Link href="/shop/necklaces" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('necklacesDrop')}</Link></li>
                <li><Link href="/shop/bracelets" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('braceletsDrop')}</Link></li>
                <li><Link href="/shop/rings" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('ringsDrop')}</Link></li>
                <li><Link href="/shop/earrings" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('earringsDrop')}</Link></li>
                <li><Link href="/shop/charms" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('charms')}</Link></li>
              </ul>
            </div>

            {/* Column 2: THE GIFT SHOP */}
            <div>
              <h4 className="font-serif text-sm uppercase tracking-widest text-[#b87333] mb-4">
                {t('giftShop')}
              </h4>
              <ul className="space-y-3">
                <li><Link href="/gifts/all" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('allGifts')}</Link></li>
                <li><Link href="/gifts/charms" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('personalisedCharms')}</Link></li>
                <li><Link href="/gifts/zodiac" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('zodiacCollection')}</Link></li>
                <li><Link href="/gifts/personalised" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('personalisedJewelry')}</Link></li>
              </ul>
            </div>

            {/* Column 3: COLLECTIONS */}
            <div>
              <h4 className="font-serif text-sm uppercase tracking-widest text-[#b87333] mb-4">
                {t('collectionsHeading')}
              </h4>
              <ul className="space-y-3">
                <li><Link href="/collections/everyday" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('everydayEssentials')}</Link></li>
                <li><Link href="/collections/statement" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('statementPieces')}</Link></li>
                <li><Link href="/collections/bestsellers" className="text-sm text-gray-600 hover:text-black transition-colors block">{t('bestSellers')}</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}