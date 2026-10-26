"use client";

import StaticPageLayout from '@/components/StaticPageLayout';
import { useLang } from '@/context/LanguageContext';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function ContactPage() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';

  return (
    <StaticPageLayout titleKey="contactUs">
      <div className="max-w-3xl mx-auto">
        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          <h3 className="font-serif text-2xl text-gray-900 mb-8 text-center">
            {isFarsi ? 'اطلاعات تماس' : 'Contact Information'}
          </h3>
          
          <div className="space-y-6">
            {/* Phone */}
            <a 
              href="tel:+989920167420" 
              className="flex items-center gap-4 text-gray-700 hover:text-[#682535] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[#682535] group-hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{isFarsi ? 'تلفن' : 'Phone'}</p>
                <span dir="ltr" className="text-lg font-medium">+98 992 016 7420</span>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:kimorojogallery@gmail.com" 
              className="flex items-center gap-4 text-gray-700 hover:text-[#682535] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[#682535] group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{isFarsi ? 'ایمیل' : 'Email'}</p>
                <span className="text-lg font-medium">kimorojogallery@gmail.com</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/989920167420" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-gray-700 hover:text-[#25D366] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">WhatsApp</p>
                <span dir="ltr" className="text-lg font-medium">+98 992 016 7420</span>
              </div>
            </a>

            {/* Telegram */}
            <a 
              href="https://t.me/KIMOROJO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-gray-700 hover:text-[#0088cc] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[#0088cc] group-hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Telegram</p>
                <span className="text-lg font-medium">@KIMOROJO</span>
              </div>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/kimorojo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-gray-700 hover:text-[#E4405F] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:bg-[#E4405F] group-hover:text-white transition-colors">
                <InstagramIcon />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Instagram</p>
                <span className="text-lg font-medium">@kimorojo</span>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-start gap-4 text-gray-700 pt-4 border-t border-gray-200">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#682535]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{isFarsi ? 'آدرس' : 'Address'}</p>
                <p className="text-lg font-medium" dir={isFarsi ? 'rtl' : 'ltr'}>
                  {isFarsi ? 'تهران، بازار بزرگ، ۱۵ خرداد' : 'Tehran, Grand Bazaar, 15th Khordad St.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}