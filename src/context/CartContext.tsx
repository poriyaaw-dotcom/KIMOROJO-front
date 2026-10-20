"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number; // Added stock to track limits
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kimorojo_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(parsed);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
        localStorage.removeItem('kimorojo_cart');
      }
    }
    setIsLoaded(true);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let newCart;
      const qtyToAdd = item.quantity || 1;
      
      if (existing) {
        // Check stock limit
        const newQty = Math.min(existing.quantity + qtyToAdd, item.stock);
        newCart = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: qtyToAdd }];
      }
      localStorage.setItem('kimorojo_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) => {
        if (item.id === id) {
          // Enforce stock limit and minimum of 1
          const newQty = Math.max(1, Math.min(quantity, item.stock));
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem('kimorojo_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => i.id !== id);
      localStorage.setItem('kimorojo_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('kimorojo_cart');
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};