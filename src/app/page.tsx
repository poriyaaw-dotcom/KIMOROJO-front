import HeroSection from "@/components/HeroSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import BannerSlider from "@/components/BannerSlider";
import CategoryRow from "@/components/CategoryRow";
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

interface Category {
  id: number;
  name_en: string;
  name_fa: string;
  slug: string;
}

// Made async to fetch data on the server (better for SEO and performance)
export default async function Home() {
  let categories: Category[] = [];

  try {
    const res = await fetch('http://127.0.0.1:8000/api/categories', { 
      next: { revalidate: 60 } // Cache for 60 seconds for fast loading
    });
    const data = await res.json();
    categories = data.data || [];
  } catch (err) {
    console.error("❌ Failed to fetch categories", err);
  }

  return (
    <div className="bg-white">
      <HeroSection />
      <CollectionsGrid />
      <BannerSlider />
      
      <div className="relative z-10 bg-white">
        <div className="pt-20">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Loading categories...
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryRow 
                key={cat.id} 
                nameEn={cat.name_en}
                nameFa={cat.name_fa}
                slug={cat.slug} 
              />
            ))
          )}
        </div>
      </div>
      
      {/* Footer is NOT here - it's in layout.tsx */}
    </div>
  );
}