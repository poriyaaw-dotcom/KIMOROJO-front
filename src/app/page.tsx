import HeroSection from "@/components/HeroSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import BannerSlider from "@/components/BannerSlider";
import NewInSlider from "@/components/NewInSlider";
import CategoryGrid from "@/components/CategoryGrid";
import { Metadata } from "next";

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

export default async function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      
      {/* Task 1: Collections (Now 2 columns, bigger pictures) */}
      <CollectionsGrid />
      
      <BannerSlider />
      
      <div className="relative z-10 bg-white space-y-12">
        {/* Task 3: New In Slider (Colored, newest products) */}
        <NewInSlider />
        
        {/* Task 2 & 4: Category Grid (Replaces old slider, 4 columns, clickable images) */}
        <CategoryGrid />
      </div>
      
      {/* Footer is NOT here - it's in layout.tsx */}
    </div>
  );
}