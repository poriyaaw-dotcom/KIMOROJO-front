"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
}

export default function AddToCartButton({ productId, productName, productPrice, productImage }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { lang } = useLang();
  const isFarsi = lang === 'fa';
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`flex-1 py-4 rounded-sm text-sm uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
        isAdded
          ? 'bg-green-600 text-white cursor-default'
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" />
          {isFarsi ? 'اضافه شد' : 'Added'}
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          {isFarsi ? 'افزودن به سبد خرید' : 'Add to Cart'}
        </>
      )}
    </button>
  );
}