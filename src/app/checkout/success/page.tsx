"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function CheckoutSuccessPage() {
  const { lang } = useLang();
  const { clearCart } = useCart();
  const isFarsi = lang === 'fa';
  const hasCleared = useRef(false);

  useEffect(() => {
    // Ensure clearCart is only called once to prevent infinite loops
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6" dir={isFarsi ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full text-center space-y-8">
        
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-serif text-gray-900">
            {isFarsi ? 'سفارش شما با موفقیت ثبت شد!' : 'Order Placed Successfully!'}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {isFarsi 
              ? 'از خرید شما متشکریم. جزئیات سفارش و کد پیگیری به زودی برای شما ارسال خواهد شد.' 
              : 'Thank you for your purchase. Your order details and tracking number will be sent to you shortly.'}
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Link 
            href="/shop" 
            className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {isFarsi ? 'ادامه خرید' : 'Continue Shopping'}
          </Link>
          
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4"
          >
            {isFarsi ? 'بازگشت به صفحه اصلی' : 'Return to Homepage'}
          </Link>
        </div>

      </div>
    </div>
  );
}