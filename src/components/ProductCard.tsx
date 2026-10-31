"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { getSafeFirstImage } from '@/utils/imageHelper';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string | string[] | null; // Updated to safely accept arrays or strings
  hoverImage?: string | string[] | null;
  category: string;
}

export default function ProductCard({ id, name, price, image, hoverImage, category }: ProductCardProps) {
  const { lang } = useLang();
  
  // Use our bulletproof helper to get a clean URL
  const mainImg = getSafeFirstImage(image) || 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80';
  const hoverImg = hoverImage ? getSafeFirstImage(hoverImage) : mainImg;

  return (
    <Link href={`/product/${id}`} className="group block">
      <div className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden mb-4">
        <img 
          src={mainImg} 
          alt={name} 
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img 
          src={hoverImg} 
          alt={`${name} view`} 
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-500 capitalize">{category}</p>
        <p className="text-sm font-medium text-gray-900 mt-2">{price}</p>
      </div>
    </Link>
  );
}