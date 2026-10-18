"use client";

import { useState, useEffect, use } from 'react';
import { useLang } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const GOLD_PRICE_PER_GRAM_TOMAN = 4500000;

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  weight: number;
  purity: string;
  metal_type: string;
  making_charges: number;
  images: string[] | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
  collection: { slug: string; name_en: string; name_fa: string } | null;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, lang } = useLang();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isFarsi = lang === 'fa';
  const { id } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        let currentProduct: Product | null = null;

        if (res.ok) {
          const data = await res.json();
          currentProduct = data.data || data;
        } else {
          const allRes = await fetch('http://127.0.0.1:8000/api/products');
          const allData = await allRes.json();
          currentProduct = allData.data?.find((p: Product) => p.id === parseInt(id)) || null;
        }

        setProduct(currentProduct);

        // Fetch related products from the same collection
        if (currentProduct?.collection?.slug) {
          const allRes = await fetch('http://127.0.0.1:8000/api/products');
          const allData = await allRes.json();
          const related = allData.data?.filter((p: Product) => 
            p.collection?.slug === currentProduct.collection?.slug && p.id !== currentProduct.id
          ).slice(0, 4) || []; // Limit to 4 related products
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Failed to fetch product data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getProductPrice = (p: Product) => {
    return (GOLD_PRICE_PER_GRAM_TOMAN * p.weight) + p.making_charges;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <p className="text-gray-500">{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <h1 className="text-4xl font-serif text-gray-900 mb-4">404</h1>
        <p className="text-gray-500 mb-8">{isFarsi ? 'محصول یافت نشد.' : 'Product not found.'}</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
          <ArrowLeft className={`w-4 h-4 ${isFarsi ? 'rotate-180' : ''}`} />
          {isFarsi ? 'بازگشت به فروشگاه' : 'Back to Shop'}
        </Link>
      </div>
    );
  }

  const productName = isFarsi ? product.name_fa : product.name_en;
  const productDesc = isFarsi ? product.description_fa : product.description_en;
  const price = getProductPrice(product);
  const isFav = isFavorite(product.id);
  
  const images = product.images && product.images.length > 0 
    ? product.images.map(img => `http://127.0.0.1:8000/storage/${img}`)
    : ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      {/* Back Button */}
      <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group">
        <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isFarsi ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
        <span className="text-sm uppercase tracking-wider">{isFarsi ? 'بازگشت به فروشگاه' : 'Back to Shop'}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
            <img 
              src={images[selectedImage]} 
              alt={productName} 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all grayscale hover:grayscale-0 ${
                    selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            {product.collection && (
              <p className="text-sm font-medium text-[#682535] mb-2 uppercase tracking-wider">
                {isFarsi ? product.collection.name_fa : product.collection.name_en}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{productName}</h1>
            <p className="text-2xl font-medium text-gray-900">{formatToman(price)}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {productDesc || (isFarsi ? 'توضیحات محصول به زودی اضافه می‌شود.' : 'Product description coming soon.')}
          </p>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{isFarsi ? 'وزن' : 'Weight'}</p>
              <p className="text-gray-900 font-medium">{product.weight}g</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{isFarsi ? 'عیار' : 'Purity'}</p>
              <p className="text-gray-900 font-medium">{product.purity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{isFarsi ? 'جنس' : 'Metal'}</p>
              <p className="text-gray-900 font-medium capitalize">{product.metal_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{isFarsi ? 'دسته‌بندی' : 'Category'}</p>
              <p className="text-gray-900 font-medium capitalize">
                {product.category ? (isFarsi ? product.category.name_fa : product.category.name_en) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-black text-white py-4 rounded-sm text-sm uppercase tracking-widest font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              {isFarsi ? 'افزودن به سبد خرید' : 'Add to Cart'}
            </button>
            
            <button 
              onClick={() => isFav ? removeFromFavorites(product.id) : addToFavorites(product.id)}
              className={`px-6 py-4 border rounded-sm transition-all duration-300 flex items-center justify-center ${
                isFav ? 'border-[#682535] text-[#682535] bg-[#682535]/5' : 'border-gray-300 text-gray-400 hover:border-gray-900 hover:text-gray-900'
              }`}
              aria-label="Toggle Favorite"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* More from this Collection Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-gray-100">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-8 text-center">
            {isFarsi ? 'محصولات بیشتر از این مجموعه' : 'More from this Collection'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {relatedProducts.map((relProduct) => {
              const relName = isFarsi ? relProduct.name_fa : relProduct.name_en;
              const relPrice = getProductPrice(relProduct);
              const relImage = relProduct.images && relProduct.images.length > 0 
                ? `http://127.0.0.1:8000/storage/${relProduct.images[0]}` 
                : '';
              
              return (
                <ProductCard 
                  key={relProduct.id} 
                  id={relProduct.id} 
                  name={relName} 
                  price={formatToman(relPrice)} 
                  image={relImage} 
                  category={relProduct.collection?.slug || ''} 
                />
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}