"use client";

export default function HeroSection() {
  // MOCK_DATA_START: Replace this URL with the hero image fetched from the backend/CMS
  const heroImage = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop";
  // MOCK_DATA_END

  return (
    <section className="relative w-full h-[80vh] overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={heroImage} 
          alt="Premium Jewelry Hero" 
          // Removed grayscale classes so it is fully colorful
          className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700" />
      </div>
    </section>
  );
}