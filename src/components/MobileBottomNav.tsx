"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Store } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const { t, lang } = useLang();
  const { cartCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isFarsi = lang === 'fa';

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('kimorojo_user_phone'));
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        <Link href="/shop" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#682535] transition-colors">
          <Store className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('shop')}</span>
        </Link>
        
        <Link href="/favorites" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#682535] transition-colors">
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">{t('favorites')}</span>
        </Link>
        
        <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#682535] transition-colors relative">
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-[#682535] text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-medium">{t('cart')}</span>
        </Link>
        
        <Link href={isLoggedIn ? "/account" : "/login"} className="flex flex-col items-center gap-1 text-gray-600 hover:text-[#682535] transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">{isFarsi ? 'حساب' : 'Account'}</span>
        </Link>
      </div>
    </div>
  );
}