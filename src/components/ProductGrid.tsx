"use client";

import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  hoverImage: string;
  category: string;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          id={product.id} 
          name={product.name} 
          price={product.price} 
          image={product.image} 
          hoverImage={product.hoverImage}
          category={product.category} 
        />
      ))}
    </div>
  );
}