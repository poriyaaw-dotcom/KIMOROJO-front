"use client";

import Link from 'next/link';
import { Send, MessageCircle } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

// Custom SVG icons for Instagram and Pinterest (same size as lucide icons)
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
  </svg>
);

// MOCK_DATA_START: Replace with actual social media links from backend/settings
const socialLinks = [
  { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
  { name: 'Pinterest', icon: PinterestIcon, href: 'https://pinterest.com' },
  { name: 'Telegram', icon: Send, href: 'https://telegram.org' },
  { name: 'WhatsApp', icon: MessageCircle, href: 'https://whatsapp.com' },
];
// MOCK_DATA_END

export default function Footer() {
  const { lang, t } = useLang();
  const isFarsi = lang === 'fa';

  return (
    <footer dir={isFarsi ? 'rtl' : 'ltr'} className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">
              KIMOROJO
            </Link>
            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors"
                  aria-label={social.name}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-black mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-sm text-gray-600 hover:text-black transition-colors">{t('shop')}</Link></li>
              <li><Link href="/collections" className="text-sm text-gray-600 hover:text-black transition-colors">{t('collections')}</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-black transition-colors">{t('about')}</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-black transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="font-serif text-lg text-black mb-6">{t('customerCare')}</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-gray-600 hover:text-black transition-colors">{t('faq')}</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-600 hover:text-black transition-colors">{t('shippingReturns')}</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/account" className="text-sm text-gray-600 hover:text-black transition-colors">{t('myProfile')}</Link></li>
            </ul>
          </div>

          {/* Column 4: E-Namad */}
          <div className="flex items-start">
            {/* MOCK_DATA_START: Replace with actual E-Namad image/script */}
            <div className="w-32 flex flex-col items-center">
              <img 
                src="/images/enamad.png"
                alt="E-Namad Trust Seal"
                className="w-full h-auto object-contain"
              />
            </div>
            {/* MOCK_DATA_END */}
          </div>
        </div>

        {/* Bottom Bar with Ares Team Credit */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-gray-500 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
            <span>{t('copyright')}</span>
            <span className="hidden md:inline">|</span>
            <span>
              {t('designedBy')}{' '}
              <a 
                href="https://ares-team.com"
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-gray-700 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-black"
              >
                {t('aresTeam')}
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}