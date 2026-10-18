"use client";

export default function HeroSection() {
  // TODO: Later, this can be fetched from a Laravel "Settings" or "Banners" API endpoint
  const heroImage = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075&auto=format&fit=crop";

  return (
    <section className="relative w-full h-[80vh] overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={heroImage} 
          alt="Premium Jewelry Hero" 
          // Fully colorful all the time, with a subtle zoom on hover
          className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-700" />
      </div>
    </section>
  );
}