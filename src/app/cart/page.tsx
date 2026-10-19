"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext'; // Import the context
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

const GOLD_PRICE_PER_GRAM_TOMAN = 4500000;

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
  const { cart, removeFromCart } = useCart(); // Use the context
  const [fullCartItems, setFullCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch full product details for items in the cart
  useEffect(() => {
    const loadFullCartDetails = async () => {
      setLoading(true);
      try {
        if (cart.length === 0) {
          setFullCartItems([]);
          setLoading(false);
          return;
        }

        // Fetch all products to get details (weight, purity, etc.)
        const res = await fetch('http://127.0.0.1:8000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];

        // Merge context cart (quantity) with API data (details)
        const merged = cart.map((contextItem) => {
          const product = allProducts.find((p: any) => p.id === contextItem.id);
          if (product) {
            return {
              ...product,
              quantity: contextItem.quantity,
            };
          }
          return null;
        }).filter(Boolean) as CartItem[];

        setFullCartItems(merged);
      } catch (error) {
        console.error("Failed to load cart details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFullCartDetails();
  }, [cart]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    
    // We need to update the context, but context doesn't have an updateQuantity function yet.
    // For now, let's just update localStorage directly to match the context key
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('kimorojo_cart', JSON.stringify(updatedCart));
    // Force a reload to sync context
    window.dispatchEvent(new Event('storage')); 
  };

  // FIX: Dynamic locale based on language
  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getItemPrice = (item: CartItem) => {
    return (GOLD_PRICE_PER_GRAM_TOMAN * item.weight) + item.making_charges;
  };

  const subtotal = fullCartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const shipping = subtotal > 5000000 ? 0 : 150000;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <p className="text-gray-500">{isFarsi ? 'در حال بارگذاری سبد خرید...' : 'Loading cart...'}</p>
      </div>
    );
  }

  if (fullCartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-serif text-gray-900 mb-4">{t('emptyCart') || 'Your cart is empty'}</h1>
        <Link 
          href="/shop" 
          className="inline-block bg-black text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors"
        >
          {t('continueShopping') || 'Continue Shopping'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center">
        {t('cart') || 'Shopping Cart'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {fullCartItems.map((item) => {
            const itemName = isFarsi ? item.name_fa : item.name_en;
            const itemPrice = getItemPrice(item);
            const itemImage = item.images && item.images.length > 0 ? `http://127.0.0.1:8000/storage/${item.images[0]}` : 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=200&q=80';

            return (
              <div 
                key={item.id} 
                className="flex gap-6 border-b border-gray-100 pb-6"
              >
                <Link href={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                    <img 
                      src={itemImage} 
                      alt={itemName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

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
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label={t('remove') || 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

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
              {t('orderSummary') || 'Order Summary'}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal') || 'Subtotal'}</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping') || 'Shipping'}</span>
                <span>{shipping === 0 ? (t('free') || 'Free') : formatToman(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900 text-base">{t('total') || 'Total'}</span>
                <span className="font-serif text-xl text-black">{formatToman(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="block w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors text-center">
              {t('checkout') || 'Checkout'}
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