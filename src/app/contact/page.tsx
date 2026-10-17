"use client";

import StaticPageLayout from '@/components/StaticPageLayout';
import { useLang } from '@/context/LanguageContext';
import { useState } from 'react';

export default function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  return (
    <StaticPageLayout titleKey="contactUs">
      <p className="mb-8">[Content waiting on employer: Contact info, email, phone, and physical store address.]</p>
      
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 max-w-lg">
          <input required placeholder={t('name')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
          <input required type="email" placeholder={t('email')} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
          <textarea required placeholder={t('message')} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black" />
          <button type="submit" className="bg-black text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors">
            {t('sendMessage')}
          </button>
        </form>
      ) : (
        <p className="text-green-600 font-medium">{t('messageSent')}</p>
      )}
    </StaticPageLayout>
  );
}