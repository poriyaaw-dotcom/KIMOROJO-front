"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Lock, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// MOCK_DATA_START
const mockOrderSummary = {
  items: 2,
  subtotal: 512.50,
  shipping: 0,
  tax: 41.00,
  total: 553.50,
};
// MOCK_DATA_END

export default function CheckoutPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  
  // Auth State
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Checkout
  const [loginPhone, setLoginPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

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
    if (otpCode.length >= 4) { // Accept any 4+ digit code for mock
      setStep(3); // Move to Checkout
    }
  };

  // DEV BYPASS: Skip directly to checkout
  const skipToCheckout = () => setStep(3);

  // --- RENDER: STEP 1 (Phone Number) ---
  if (step === 1) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Phone className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <h1 className="text-2xl font-serif text-gray-900 mb-3">{t('loginToCheckout')}</h1>
        <p className="text-sm text-gray-500 mb-8">{t('enterPhone')}</p>
        
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
            {t('continue')}
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
        <h1 className="text-2xl font-serif text-gray-900 mb-3">{t('verify')}</h1>
        <p className="text-sm text-gray-500 mb-2">{t('enterOtp')}</p>
        <p className="text-sm text-gray-400 mb-8 dir-ltr">
          {t('codeSentTo')} <span className="text-gray-700 font-medium">{loginPhone}</span>
        </p>
        
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <input 
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5))} // Only numbers, max 5
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
            {t('verify')}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <button type="button" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">
            {t('resendCode')}
          </button>
          <br />
          <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-black transition-colors">
            {t('changeNumber')}
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
          {t('cart')}
        </Link>
      </div>

      <h1 className="text-3xl font-serif text-gray-900 mb-10 text-center md:text-left">
        {t('checkout')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Forms */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Contact Information */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('contactInfo')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input 
                  type="tel" 
                  defaultValue={loginPhone}
                  dir="ltr"
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all text-right"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('shippingAddress')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('postalCode')}</label>
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
              {t('orderSummary')} ({mockOrderSummary.items} {t('cart').toLowerCase()})
            </h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Classic Gold Band × 1</span>
                <span className="font-medium text-gray-900">$272.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Silver Twist Ring × 2</span>
                <span className="font-medium text-gray-900">$240.00</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span>${mockOrderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span>{mockOrderSummary.shipping === 0 ? t('free') : `$${mockOrderSummary.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('tax')}</span>
                <span>${mockOrderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900 text-base">{t('total')}</span>
                <span className="font-serif text-2xl text-black">${mockOrderSummary.total.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              {t('placeOrder')}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              {t('secureCheckout')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}