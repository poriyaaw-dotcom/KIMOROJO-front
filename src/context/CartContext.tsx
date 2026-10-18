"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('kimorojo_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCart(parsed);
      setCartCount(parsed.reduce((acc: number, item: CartItem) => acc + item.quantity, 0));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let newCart;
      if (existing) {
        newCart = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newCart = [...prev, { ...item, quantity: 1 }];
      }
      localStorage.setItem('kimorojo_cart', JSON.stringify(newCart));
      setCartCount(newCart.reduce((acc, i) => acc + i.quantity, 0));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter((i) => i.id !== id);
      localStorage.setItem('kimorojo_cart', JSON.stringify(newCart));
      setCartCount(newCart.reduce((acc, i) => acc + i.quantity, 0));
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('kimorojo_cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};