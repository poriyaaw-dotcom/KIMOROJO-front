"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

// Dynamic pricing constant (Placeholder until live API is added at the end of the project)
const GOLD_PRICE_PER_GRAM_TOMAN = 4500000; // Example: 4,500,000 Toman per gram

interface CartItem {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  making_charges: number;
  images: string[] | null;
  quantity: number;
}

export default function CartPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage and fetch real product details from Laravel
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        // 1. Get cart IDs and quantities from localStorage
        // Expected format: [{ id: 1, quantity: 1 }]
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (localCart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // 2. Fetch all products from backend
        const res = await fetch('http://127.0.0.1:8000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];

        // 3. Merge local cart quantities with backend product data
        const mergedCart: CartItem[] = localCart.map((localItem: any) => {
          const product = allProducts.find((p: any) => p.id === localItem.id);
          if (product) {
            return {
              ...product,
              quantity: localItem.quantity,
            };
          }
          return null;
        }).filter(Boolean) as CartItem[];

        setCartItems(mergedCart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Update local state
    setCartItems(items =>
      items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );

    // Update localStorage
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedLocalCart = localCart.map((item: any) => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedLocalCart));
  };

  const removeItem = (id: number) => {
    // Update local state
    setCartItems(items => items.filter(item => item.id !== id));

    // Update localStorage
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedLocalCart = localCart.filter((item: any) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedLocalCart));
  };

  // Calculate price for a single item: (Gold Price * Weight) + Making Charges
  const getItemPrice = (item: CartItem) => {
    return (GOLD_PRICE_PER_GRAM_TOMAN * item.weight) + item.making_charges;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const shipping = subtotal > 5000000 ? 0 : 150000; // Free shipping over 5,000,000 Toman
  const total = subtotal + shipping;

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <p className="text-gray-500">{isFarsi ? 'در حال بارگذاری سبد خرید...' : 'Loading cart...'}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-serif text-gray-900 mb-4">{t('emptyCart')}</h1>
        <Link 
          href="/shop" 
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
            const itemName = isFarsi ? item.name_fa : item.name_en;
            const itemPrice = getItemPrice(item);
            const itemImage = item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=200&q=80';

            return (
              <div 
                key={item.id} 
                className="flex gap-6 border-b border-gray-100 pb-6"
              >
                {/* Image - Grayscale to color on hover (Project Rule) */}
                <Link href={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                    <img 
                      src={itemImage} 
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
                        {item.purity} | {item.weight}g
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
                      {formatToman(itemPrice * item.quantity)}
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
                <span>{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : formatToman(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900 text-base">{t('total')}</span>
                <span className="font-serif text-xl text-black">{formatToman(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors text-center">
              {t('checkout')}
            </Link>

            <p className="text-xs text-gray-400 text-center mt-4">
              {isFarsi ? 'هزینه ارسال در مرحله پرداخت نهایی محاسبه می‌شود.' : 'Shipping calculated at checkout.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}