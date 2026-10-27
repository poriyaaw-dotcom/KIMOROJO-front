"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Phone, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loginPhone, setLoginPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  // OTP Security States
  const [timeLeft, setTimeLeft] = useState(60);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  // Load lock status on mount (persists across refreshes)
  useEffect(() => {
    const lockUntil = localStorage.getItem('otp_lock_until');
    const attempts = parseInt(localStorage.getItem('otp_wrong_attempts') || '0', 10);
    
    if (lockUntil && Date.now() < parseInt(lockUntil, 10)) {
      setIsLocked(true);
      setLockTimeLeft(Math.ceil((parseInt(lockUntil, 10) - Date.now()) / 1000));
      setWrongAttempts(attempts);
    } else {
      localStorage.removeItem('otp_lock_until');
      localStorage.setItem('otp_wrong_attempts', '0');
    }
  }, []);

  // Countdown timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeLeft > 0 && !isLocked && step === 2) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    
    if (lockTimeLeft > 0 && isLocked) {
      interval = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setWrongAttempts(0);
            localStorage.removeItem('otp_lock_until');
            localStorage.setItem('otp_wrong_attempts', '0');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timeLeft, lockTimeLeft, isLocked, step]);

  const normalizePhone = (phone: string) => {
    return phone
      .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1728))
      .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 1584))
      .replace(/[\s\-]/g, '');
  };

  const isValidIranianPhone = (phone: string) => {
    const regex = /^(\+98|0)9\d{9}$/;
    return regex.test(phone);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizePhone(loginPhone);
    
    if (!isValidIranianPhone(normalizedPhone)) {
      setPhoneError(isFarsi ? 'شماره تلفن معتبر نیست. فرمت صحیح: 09123456789 یا +989123456789' : 'Invalid phone number. Format: 09123456789 or +989123456789');
      return;
    }

    setPhoneError('');
    setLoginPhone(normalizedPhone);
    setStep(2);
    setTimeLeft(60); // Reset resend timer on new phone entry
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (otpCode === "12345") {
      // Success: Clear all OTP security data
      localStorage.removeItem('otp_lock_until');
      localStorage.removeItem('otp_wrong_attempts');
      
      localStorage.setItem('kimorojo_user_phone', loginPhone);
      const redirectUrl = localStorage.getItem('redirect_after_login') || '/account';
      localStorage.removeItem('redirect_after_login');
      router.push(redirectUrl);
    } else {
      const newAttempts = wrongAttempts + 1;
      setWrongAttempts(newAttempts);
      localStorage.setItem('otp_wrong_attempts', newAttempts.toString());

      if (newAttempts >= 5) {
        const lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
        setIsLocked(true);
        setLockTimeLeft(15 * 60);
        localStorage.setItem('otp_lock_until', lockUntil.toString());
        alert(isFarsi ? "تعداد تلاش‌های ناموفق زیاد است. ورود به مدت ۱۵ دقیقه قفل شد." : "Too many failed attempts. Login locked for 15 minutes.");
      } else {
        alert(isFarsi ? `کد تایید اشتباه است. ${5 - newAttempts} تلاش دیگر باقی مانده است.` : `Invalid OTP. ${5 - newAttempts} attempts remaining.`);
      }
      setOtpCode(''); // Clear input for retry
    }
  };

  const handleResend = () => {
    if (timeLeft === 0 && !isLocked) {
      setTimeLeft(60);
      // TODO: Later, trigger backend API to resend real OTP here
      alert(isFarsi ? "کد جدید ارسال شد." : "New code sent.");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              onChange={(e) => {
                setLoginPhone(e.target.value);
                if (phoneError) setPhoneError('');
              }}
              placeholder="09123456789" 
              dir="ltr"
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 transition-all text-center text-lg tracking-wider ${
                phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
              }`} 
              required
            />
            {phoneError && (
              <div className="flex items-center gap-2 text-red-600 text-sm justify-center bg-red-50 p-2 rounded">
                <AlertCircle className="w-4 h-4" />
                <span>{phoneError}</span>
              </div>
            )}
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
          
          {isLocked ? (
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm mb-6 bg-red-50 py-3 px-4 rounded border border-red-200">
              <Clock className="w-4 h-4" />
              <span>{isFarsi ? `حساب قفل است. لطفاً ${formatTime(lockTimeLeft)} دیگر صبر کنید.` : `Account locked. Please wait ${formatTime(lockTimeLeft)}.`}</span>
            </div>
          ) : (
            <p className="text-xs text-amber-700 mb-6 font-medium bg-amber-50 py-2 px-3 rounded inline-block border border-amber-200">
              {isFarsi ? '💡 کد تست: 12345' : '💡 Test OTP Code: 12345'}
            </p>
          )}

          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <input 
              type="text" 
              value={otpCode} 
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="• • • • •" 
              dir="ltr" 
              maxLength={5}
              disabled={isLocked}
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-1 transition-all text-center text-2xl tracking-[0.5em] font-medium ${
                isLocked ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'border-gray-200 focus:ring-black'
              }`} 
              required
            />
            <button 
              type="submit" 
              disabled={isLocked}
              className={`w-full font-medium tracking-widest uppercase py-4 rounded-sm transition-colors ${
                isLocked 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isLocked ? (isFarsi ? 'قفل شده' : 'Locked') : (t('verify') || 'Verify')}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button 
              onClick={() => { setStep(1); setPhoneError(''); }} 
              className="text-xs text-gray-400 hover:text-black transition-colors"
            >
              {t('changeNumber') || 'Change Number'}
            </button>
            
            <button
              onClick={handleResend}
              disabled={timeLeft > 0 || isLocked}
              className={`text-sm font-medium transition-colors ${
                timeLeft > 0 || isLocked 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-[#682535] hover:underline'
              }`}
            >
              {timeLeft > 0 
                ? (isFarsi ? `ارسال مجدد کد (${formatTime(timeLeft)})` : `Resend code (${formatTime(timeLeft)})`)
                : (isFarsi ? 'ارسال مجدد کد' : 'Resend code')
              }
            </button>
          </div>
        </>
      )}
      
      <div className="mt-12">
        <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">KIMOROJO</Link>
      </div>
    </div>
  );
}