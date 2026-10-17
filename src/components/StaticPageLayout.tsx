"use client";

import { useLang } from '@/context/LanguageContext';

export default function StaticPageLayout({ titleKey, children }: { titleKey: string, children: React.ReactNode }) {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';

  return (
    <div className="max-w-4xl mx-auto px-6 py-20" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-12 text-center">
        {t(titleKey)}
      </h1>
      <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
        {children}
      </div>
    </div>
  );
}