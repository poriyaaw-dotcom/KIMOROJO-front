"use client";

import StaticPageLayout from '@/components/StaticPageLayout';
import { useLang } from '@/context/LanguageContext';

export default function AboutPage() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';

  const content = isFarsi 
    ? [
        "KIMOROJO از کنار هم قرارگرفتن نام و نگاه دو خواهر، کیمیا و روژین، شکل گرفت.",
        "برای ما زیورآلات فقط یک اکسسوری نیستند؛ هر قطعه می‌تواند یادآور یک احساس، یک لحظه یا بخشی از هویت صاحبش باشد.",
        "در طراحی‌های KIMOROJO، ظرافت معاصر با الهام‌های ساده و بازطراحی‌شده از هنر ایرانی همراه می‌شود. هدف ما خلق زیورهایی دقیق، ماندگار و شخصی است؛ قطعاتی که امروز پوشیده شوند و فردا داستانی برای روایت‌کردن داشته باشند.",
        "داستان KIMOROJO با دو خواهر آغاز شد؛ ادامه‌ی آن با داستان شماست."
      ]
    : [
        "KIMOROJO was born from the shared vision and names of two sisters, Kimia and Rozhin.",
        "For us, jewelry is more than just an accessory. Each piece is designed to be a reminder of a feeling, a cherished moment, or a reflection of its owner's unique identity.",
        "In KIMOROJO's designs, contemporary elegance meets reimagined inspirations from traditional Iranian art. Our goal is to craft precise, enduring, and deeply personal jewelry—pieces that are worn today and carry a story to be told tomorrow.",
        "The story of KIMOROJO began with two sisters. Its continuation is your story."
      ];

  return (
    <StaticPageLayout titleKey="aboutUs">
      <div className="max-w-3xl mx-auto space-y-8" dir={isFarsi ? 'rtl' : 'ltr'}>
        {content.map((paragraph, index) => {
          const isLastParagraph = index === content.length - 1;
          
          return (
            <p 
              key={index} 
              className={`text-lg leading-relaxed text-gray-700 transition-all duration-500 ${
                isFarsi ? 'font-normal' : 'font-serif'
              } ${
                isLastParagraph 
                  ? 'text-[#682535] font-medium text-xl md:text-2xl mt-12 text-center pt-8 border-t border-gray-100' 
                  : ''
              }`}
            >
              {paragraph}
            </p>
          );
        })}
      </div>
    </StaticPageLayout>
  );
}