"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

// MOCK_DATA_START: Replace with cart state from backend/context
const mockCartItems = [
  {
    id: 1,
    nameEn: "Classic Gold Band",
    nameFa: "انگشتر طلای کلاسیک",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=200&q=80",
    price: 272.50,
    quantity: 1,
    size: "8",
  },
  {
    id: 2,
    nameEn: "Silver Twist Ring",
    nameFa: "انگشتر نقره‌ای پیچ‌دار",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=200&q=80",
    price: 120.00,
    quantity: 2,
    size: "7",
  },
];
// MOCK_DATA_END

export default function CartPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-serif text-gray-900 mb-4">{t('emptyCart')}</h1>
        <Link 
          href="/shop/rings" 
          className="inline-block bg-black text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
        {t('cart')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const itemName = isFarsi ? item.nameFa : item.nameEn;
            return (
              <div 
                key={item.id} 
                className="flex gap-6 border-b border-gray-100 pb-6"
              >
                {/* Image */}
                <Link href={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={itemName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link href={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-black transition-colors">
                        {itemName}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('size')}: {item.size}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 sticky top-24">
            <h2 className="font-serif text-lg text-black mb-6">
              {t('orderSummary')}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('tax')}</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900 text-base">{t('total')}</span>
                <span className="font-serif text-xl text-black">${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors">
              {t('checkout')}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              {isFarsi ? 'مالیات و هزینه ارسال در مرحله پرداخت محاسبه می‌شود.' : 'Tax and shipping calculated at checkout.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}