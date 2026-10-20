"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  productPrice: number;
  productImage: string;
  stock: number;
}

export default function AddToCartButton({ productId, productName, productPrice, productImage, stock }: AddToCartButtonProps) {
  const { addToCart, cart } = useCart();
  const { lang } = useLang();
  const isFarsi = lang === 'fa';
  const [isAdded, setIsAdded] = useState(false);

  // Find current quantity of this item in the cart
  const currentInCart = cart.find((item) => item.id === productId)?.quantity || 0;
  const isOutOfStock = stock === 0;
  const isMaxReached = currentInCart >= stock;

  const handleAddToCart = () => {
    if (isOutOfStock || isMaxReached) return;

    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      stock: stock,
      quantity: 1,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (isOutOfStock) {
    return (
      <button disabled className="flex-1 py-4 rounded-sm text-sm uppercase tracking-widest font-medium bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center gap-3">
        <AlertCircle className="w-5 h-5" />
        {isFarsi ? 'ناموجود' : 'Out of Stock'}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdded || isMaxReached}
      className={`flex-1 py-4 rounded-sm text-sm uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-3 ${
        isMaxReached
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : isAdded
          ? 'bg-green-600 text-white cursor-default'
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" />
          {isFarsi ? 'اضافه شد' : 'Added'}
        </>
      ) : isMaxReached ? (
        <>
          <AlertCircle className="w-5 h-5" />
          {isFarsi ? 'حداکثر موجودی' : 'Max Stock Reached'}
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