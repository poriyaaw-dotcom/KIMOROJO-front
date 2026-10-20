"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loginPhone, setLoginPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Convert Farsi/Arabic numbers to English
  const normalizePhone = (phone: string) => {
    return phone
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584));
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(loginPhone);
    if (normalizedPhone.length > 5) {
      setLoginPhone(normalizedPhone);
      setStep(2);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === "12345") {
      localStorage.setItem('kimorojo_user_phone', loginPhone);
      // Redirect to checkout or account
      const redirectUrl = localStorage.getItem('redirect_after_login') || '/account';
      localStorage.removeItem('redirect_after_login');
      router.push(redirectUrl);
    } else {
      alert(isFarsi ? "کد تایید اشتباه است. برای تست از 12345 استفاده کنید." : "Invalid OTP. For testing, use 12345.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
      <div className="flex justify-center mb-8">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
          {step === 1 ? <Phone className="w-8 h-8 text-gray-600" /> : <ShieldCheck className="w-8 h-8 text-gray-600" />}
        </div>
      </div>
      
      {step === 1 ? (
        <>
          <h1 className="text-2xl font-serif text-gray-900 mb-3">{t('login') || 'Login'}</h1>
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
        </>
      ) : (
        <>
          <h1 className="text-2xl font-serif text-gray-900 mb-3">{t('verify') || 'Verify'}</h1>
          <p className="text-sm text-gray-500 mb-2">{t('enterOtp') || 'Enter the verification code'}</p>
          <p className="text-sm text-gray-400 mb-2 dir-ltr">{t('codeSentTo') || 'Code sent to'} <span className="text-gray-700 font-medium">{loginPhone}</span></p>
          
          <p className="text-xs text-amber-700 mb-6 font-medium bg-amber-50 py-2 px-3 rounded inline-block border border-amber-200">
            {isFarsi ? '💡 کد تست: 12345' : '💡 Test OTP Code: 12345'}
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
          <div className="mt-6">
            <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-black transition-colors">{t('changeNumber') || 'Change Number'}</button>
          </div>
        </>
      )}
      
      <div className="mt-12">
        <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">KIMOROJO</Link>
      </div>
    </div>
  );
}