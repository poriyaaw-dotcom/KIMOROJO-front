import HeroSection from "@/components/HeroSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import BannerSlider from "@/components/BannerSlider";
import NewInSlider from "@/components/NewInSlider";
import CategoryGrid from "@/components/CategoryGrid";
import { Metadata } from "next";
import { Suspense } from "react";

// --- BILINGUAL SEO METADATA FOR HOMEPAGE ---
export const metadata: Metadata = {
  title: 'KIMOROJO | Premium Handcrafted Gold & Silver Jewelry | جواهرات دست‌ساز طلا و نقره',
  description: 'Discover our exquisite collection of handcrafted gold and silver jewelry. Shop rings, necklaces, and bracelets. | مجموعه‌ای بی‌نظیر از جواهرات دست‌ساز طلا و نقره. خرید انگشتر، گردنبند و دستبند.',
  keywords: ['gold jewelry', 'silver jewelry', 'handcrafted jewelry', 'جواهرات طلا', 'جواهرات نقره', 'خرید طلا', 'KIMOROJO'],
  openGraph: {
    title: 'KIMOROJO | Premium Handcrafted Gold & Silver Jewelry | جواهرات دست‌ساز طلا و نقره',
    description: 'Discover our exquisite collection of handcrafted gold and silver jewelry. | مجموعه‌ای بی‌نظیر از جواهرات دست‌ساز طلا و نقره.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIMOROJO | Premium Handcrafted Gold & Silver Jewelry | جواهرات دست‌ساز طلا و نقره',
    description: 'Discover our exquisite collection of handcrafted gold and silver jewelry. | مجموعه‌ای بی‌نظیر از جواهرات دست‌ساز طلا و نقره.',
  },
};

// Loading fallback component
function ComponentSkeleton() {
  return (
    <div className="py-12 px-6 max-w-7xl mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      
      {/* Wrap each component in Suspense to prevent one failure from crashing the page */}
      <Suspense fallback={<ComponentSkeleton />}>
        <CollectionsGrid />
      </Suspense>
      
      <BannerSlider />
      
      <div className="relative z-10 bg-white space-y-12">
        <Suspense fallback={<ComponentSkeleton />}>
          <NewInSlider />
        </Suspense>
        
        <Suspense fallback={<ComponentSkeleton />}>
          <CategoryGrid />
        </Suspense>
      </div>
    </div>
  );
}