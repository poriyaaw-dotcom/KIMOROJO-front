import HeroSection from "@/components/HeroSection";
import CollectionsGrid from "@/components/CollectionsGrid";
import BannerSlider from "@/components/BannerSlider";
import CategoryRow from "@/components/CategoryRow";

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <CollectionsGrid />
      
      <BannerSlider />
      
      <div className="relative z-10 bg-white pt-20">
        <CategoryRow titleKey="rings" category="rings" />
        <CategoryRow titleKey="necklaces" category="necklaces" />
        <CategoryRow titleKey="bracelets" category="bracelets" />
        <CategoryRow titleKey="earrings" category="earrings" />
      </div>
    </div>
  );
}