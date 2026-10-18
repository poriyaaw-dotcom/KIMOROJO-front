"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  hoverImage?: string;
  category: string;
}

const getImageUrl = (imgPath: string) => {
  if (!imgPath) return 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=400&q=80';
  if (imgPath.startsWith('http')) return imgPath;
  return `http://127.0.0.1:8000/storage/${imgPath}`;
};

export default function ProductCard({ id, name, price, image, hoverImage, category }: ProductCardProps) {
  const { lang } = useLang();
  
  const mainImg = getImageUrl(image);
  const hoverImg = hoverImage ? getImageUrl(hoverImage) : mainImg;

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