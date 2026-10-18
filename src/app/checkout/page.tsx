"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Lock, Phone, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GOLD_PRICE_PER_GRAM_TOMAN = 4500000; // Placeholder until live API is added

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

export default function CheckoutPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();
  
  // Auth State
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Checkout
  const [loginPhone, setLoginPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart data when component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (localCart.length === 0) {
          router.push('/cart');
          return;
        }

        const res = await fetch('http://127.0.0.1:8000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];

        const mergedCart: CartItem[] = localCart.map((localItem: any) => {
          const product = allProducts.find((p: any) => p.id === localItem.id);
          if (product) {
            return { ...product, quantity: localItem.quantity };
          }
          return null;
        }).filter(Boolean) as CartItem[];

        setCartItems(mergedCart);
      } catch (error) {
        console.error("Failed to load cart for checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [router]);

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getItemPrice = (item: CartItem) => {
    return (GOLD_PRICE_PER_GRAM_TOMAN * item.weight) + item.making_charges;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const shipping = subtotal > 5000000 ? 0 : 150000; // Free shipping over 5,000,000 Toman
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Step 1: Submit Phone
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.length > 5) {
      setStep(2); // Move to OTP screen
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length >= 4) {
      setStep(3); // Move to Checkout
    }
  };

  // DEV BYPASS: Skip directly to checkout
  const skipToCheckout = () => setStep(3);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <p className="text-gray-500">{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</p>
      </div>
    );
  }

  // --- RENDER: STEP 1 (Phone Number) ---
  if (step === 1) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <h1 className="text-2xl font-serif text-gray-900 mb-3">{t('loginToCheckout') || 'Login to Checkout'}</h1>
        <p className="text-sm text-gray-500 mb-8">{t('enterPhone') || 'Please enter your phone number'}</p>
        
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <input 
            type="tel"
            value={loginPhone}
            onChange={(e) => setLoginPhone(e.target.value)}
            placeholder="+98 912 345 6789"
            dir="ltr"
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all text-center text-lg tracking-wider"
            required
          />
          <button 
            type="submit"
            className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 rounded-sm hover:bg-gray-800 transition-colors"
          >
            {t('continue') || 'Continue'}
          </button>
        </form>

        <button onClick={skipToCheckout} className="mt-8 text-xs text-gray-400 hover:text-black underline transition-colors">
          Skip Login (Developer Mode)
        </button>

        <div className="mt-12">
          <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">
            KIMOROJO
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER: STEP 2 (OTP Code) ---
  if (step === 2) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <h1 className="text-2xl font-serif text-gray-900 mb-3">{t('verify') || 'Verify'}</h1>
        <p className="text-sm text-gray-500 mb-2">{t('enterOtp') || 'Enter the verification code'}</p>
        <p className="text-sm text-gray-400 mb-8 dir-ltr">
          {t('codeSentTo') || 'Code sent to'} <span className="text-gray-700 font-medium">{loginPhone}</span>
        </p>
        
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <input 
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="• • • • •"
            dir="ltr"
            maxLength={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all text-center text-2xl tracking-[0.5em] font-medium"
            required
          />
          <button 
            type="submit"
            className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 rounded-sm hover:bg-gray-800 transition-colors"
          >
            {t('verify') || 'Verify'}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <button type="button" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">
            {t('resendCode') || 'Resend Code'}
          </button>
          <br />
          <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-black transition-colors">
            {t('changeNumber') || 'Change Number'}
          </button>
          <br />
          <button onClick={skipToCheckout} className="text-xs text-gray-400 hover:text-black underline transition-colors">
            Skip OTP (Developer Mode)
          </button>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">
            KIMOROJO
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER: STEP 3 (Main Checkout) ---
  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">
          KIMOROJO
        </Link>
        <Link href="/cart" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">
          {t('cart') || 'Cart'}
        </Link>
      </div>

      <h1 className="text-3xl font-serif text-gray-900 mb-10 text-center md:text-left">
        {t('checkout') || 'Checkout'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Forms */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Contact Information */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('contactInfo') || 'Contact Information'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email') || 'Email'}</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone') || 'Phone'}</label>
                <input 
                  type="tel" 
                  defaultValue={loginPhone}
                  dir="ltr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('shippingAddress') || 'Shipping Address'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName') || 'Full Name'}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address') || 'Address'}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city') || 'City'}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('postalCode') || 'Postal Code'}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 sticky top-24">
            <h2 className="font-serif text-lg text-black mb-6">
              {t('orderSummary') || 'Order Summary'} ({totalItems} {t('items') || 'items'})
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {cartItems.map((item) => {
                const itemName = isFarsi ? item.name_fa : item.name_en;
                const itemPrice = getItemPrice(item);
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {itemName} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatToman(itemPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 text-sm">
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
                <span className="font-serif text-2xl text-black">{formatToman(total)}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              {t('placeOrder') || 'Place Order'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              {t('secureCheckout') || 'Secure Checkout'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}