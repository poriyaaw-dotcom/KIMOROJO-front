import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string | null;
  description_fa: string | null;
  weight: number;
  purity: string;
  making_charges: number;
  images: string[] | null;
  category: { name_en: string; name_fa: string } | null;
  collection: { name_en: string; name_fa: string } | null;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
    cache: 'no-store',
  });
  
  if (!res.ok) notFound();
  
  const data = await res.json();
  if (!data.success || !data.data) notFound();

  const product = data.data;
  const GOLD_PRICE_PER_GRAM_TOMAN = 4500000; 
  const totalPrice = (GOLD_PRICE_PER_GRAM_TOMAN * product.weight) + product.making_charges;

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Image Section - Grayscale by default, color on hover (Project Rule) */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out shadow-sm hover:shadow-xl">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm">Product Image Placeholder</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-amber-600 mb-2 uppercase tracking-wider">
            {product.collection?.name_en || 'Collection'}
          </p>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {product.name_fa}
          </h1>
          <p className="text-lg text-gray-500 mb-6 font-light">
            {product.name_en}
          </p>

          {/* Specifications */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
              Purity: {product.purity}
            </span>
            <span className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
              Weight: {product.weight}g
            </span>
            {product.category && (
              <span className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                Category: {product.category.name_en}
              </span>
            )}
          </div>

          {/* Dynamic Price Box */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
              Total Estimated Price
            </p>
            <p className="text-4xl font-bold text-amber-900 mb-2">
              {formatToman(totalPrice)}
            </p>
            <p className="text-xs text-amber-700/70">
              Based on {formatToman(GOLD_PRICE_PER_GRAM_TOMAN).replace(' تومان', '')}/g + {formatToman(product.making_charges)} making charges
            </p>
          </div>

          {/* Description */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description_fa || product.description_en || 'An exquisite piece of jewelry, crafted with precision and care.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {/* THIS IS THE WIRED-UP BUTTON */}
            <AddToCartButton productId={product.id} />
            
            <button className="px-6 py-4 border border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 text-xl">
              ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}