"use client";

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';

export default function AddToCartButton({ productId }: { productId: number }) {
  const { t } = useLang();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    // 1. Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // 2. Check if this product is already in the cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === productId);
    
    if (existingItemIndex > -1) {
      // If yes, increment quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // If no, add it with quantity 1
      existingCart.push({ id: productId, quantity: 1 });
    }
    
    // 3. Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // 4. Give the user visual feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={isAdded}
      className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] ${
        isAdded 
          ? 'bg-green-700 text-white cursor-default' 
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {isAdded ? (t('addedToCart') || 'Added!') : (t('addToCart') || 'Add to Cart')}
    </button>
  );
}