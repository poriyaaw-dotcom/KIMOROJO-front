"use client";

import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  hoverImage: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, hoverImage, category }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={`/product/${id}`} 
      className="group cursor-pointer block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 mb-4 relative">
        {/* Main image - always colorful */}
        <img 
          src={image} 
          alt={name} 
          className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${
            isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        {/* Hover image - model wearing the jewelry */}
        <img 
          src={hoverImage} 
          alt={`${name} on model`} 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900 text-sm md:text-base">{name}</h3>
          <p className="text-xs text-gray-500 capitalize mt-1">{category}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">{price}</p>
      </div>
    </Link>
  );
}