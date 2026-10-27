"use client";

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import Link from 'next/link';
import { ArrowLeft, Heart, ZoomIn } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import AddToCartButton from '@/components/AddToCartButton';
import { calculateProductPrice, PricingSettings } from '@/utils/calculatePrice';

interface Product {
  id: number;
  name_en: string;
  name_fa: string;
  description_en: string;
  description_fa: string;
  weight: number | string;
  purity: string;
  metal_type: string;
  making_charges: number | string;
  accessories_price?: number | string;
  accessories_making_charges?: number | string;
  accessories_profit?: number | string;
  apply_tax_on_accessories?: boolean | number;
  stock: number;
  images: string[] | null;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
  collection: { slug: string; name_en: string; name_fa: string } | null;
}

export default function ProductClient({ 
  product, 
  settings, 
  relatedProducts 
}: { 
  product: Product; 
  settings: PricingSettings; 
  relatedProducts: Product[]; 
}) {
  const { t, lang } = useLang();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isFarsi = lang === 'fa';
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const productName = isFarsi ? product.name_fa : product.name_en;
  const productDesc = isFarsi ? product.description_fa : product.description_en;
  const isFav = isFavorite(product.id);
  
  const images = product.images && product.images.length > 0 
    ? product.images.map(img => `http://127.0.0.1:8000/storage/${img}`)
    : ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80'];

  // --- USE CENTRALIZED PRICING FUNCTION ---
  const finalPrice = calculateProductPrice(product, settings);

  // Breakdown calculation for UI display
  const P = product.metal_type === 'silver' 
    ? (Number(settings.silver_price) || 4900000) 
    : (Number(settings.gold_price) || 26000000);
  const B = Number(settings.seller_profit) || 0.07;
  const T = Number(settings.tax_rate) || 0.10;
  const M = Number(product.weight) || 0;
  const W_percent = Number(product.making_charges || 0) / 100;
  const accBase = Number(product.accessories_price || 0);
  const accMakingPercent = Number(product.accessories_making_charges || 0) / 100;
  const accProfitPercent = Number(product.accessories_profit || 0) / 100;
  const applyTax = Boolean(product.apply_tax_on_accessories);

  const baseMetalValue = P * M;
  const metalMakingCharges = baseMetalValue * W_percent;
  const accMakingCharges = accBase * accMakingPercent;
  const totalMakingCharges = metalMakingCharges + accMakingCharges;
  const metalProfit = (baseMetalValue + metalMakingCharges) * B;
  const accProfit = (accBase + accMakingCharges) * accProfitPercent;
  const totalProfit = metalProfit + accProfit;

  let vatTotal = 0;
  if (applyTax) {
    vatTotal = (totalMakingCharges + totalProfit + accBase) * T;
  } else {
    vatTotal = (metalMakingCharges + metalProfit) * T;
  }

  const breakdown = { 
    isSilver: product.metal_type === 'silver',
    baseMetalValue,
    accBase,
    totalMakingCharges,
    totalProfit,
    vatTotal,
    W: Number(product.making_charges || 0),
    B,
    T,
    applyTax
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + delta, 1), 3);
    setScale(newScale);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale > 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setScale(1);
    setPosition({ x: 50, y: 50 });
  };

  const lastUpdated = new Date();
  const formattedTime = isFarsi 
    ? lastUpdated.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    : lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group">
        <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isFarsi ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
        <span className="text-sm uppercase tracking-wider">{isFarsi ? 'بازگشت به فروشگاه' : 'Back to Shop'}</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div 
            className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative cursor-zoom-in"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              src={images[selectedImage]} 
              alt={productName} 
              className="w-full h-full object-cover transition-transform duration-200 ease-out"
              style={{ transform: `scale(${scale})`, transformOrigin: `${position.x}% ${position.y}%` }}
            />
            {scale > 1 && (
              <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 pointer-events-none">
                <ZoomIn className="w-3 h-3" />
                {Math.round(scale * 100)}%
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => { setSelectedImage(index); setScale(1); setPosition({ x: 50, y: 50 }); }}
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

        <div className="flex flex-col justify-center space-y-8">
          <div>
            {product.collection && (
              <p className="text-sm font-medium text-[#682535] mb-2 uppercase tracking-wider">
                {isFarsi ? product.collection.name_fa : product.collection.name_en}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{productName}</h1>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {productDesc || (isFarsi ? 'توضیحات محصول به زودی اضافه می‌شود.' : 'Product description coming soon.')}
          </p>

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

          <div className="text-center md:text-start p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between gap-4">
              {product.metal_type === 'silver' ? (
                <p className="text-base font-bold text-gray-800">
                  {isFarsi 
                    ? `قیمت لحظه‌ای نقره: ${formatToman(settings.silver_price).replace(' تومان', '')} / گرم` 
                    : `Live Silver Price: ${formatToman(settings.silver_price).replace(' Toman', '')} / g`}
                </p>
              ) : (
                <p className="text-base font-bold text-gray-800">
                  {isFarsi 
                    ? `قیمت لحظه‌ای طلا: ${formatToman(settings.gold_price).replace(' تومان', '')} / گرم` 
                    : `Live Gold Price: ${formatToman(settings.gold_price).replace(' Toman', '')} / g`}
                </p>
              )}
              
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {isFarsi 
                  ? `به‌روزرسانی: ${formattedTime}` 
                  : `Updated: ${formattedTime}`}
              </span>
            </div>
          </div>

          {/* SIMPLIFIED PRICE BREAKDOWN */}
          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 space-y-3">
            <h3 className="font-medium text-gray-900 mb-3">{isFarsi ? 'جزئیات قیمت' : 'Price Breakdown'}</h3>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{isFarsi ? (breakdown.isSilver ? 'ارزش نقره' : 'ارزش طلا') : (breakdown.isSilver ? 'Silver Value' : 'Gold Value')}</span>
              <span>{formatToman(breakdown.baseMetalValue)}</span>
            </div>
            
            {breakdown.accBase > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>{isFarsi ? 'متعلقات' : 'Accessories'}</span>
                <span>{formatToman(breakdown.accBase)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{isFarsi ? 'اجرت ساخت' : 'Making Charges'} ({breakdown.W}%)</span>
              <span>{formatToman(breakdown.totalMakingCharges)}</span>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>{isFarsi ? 'سود فروشنده' : 'Seller Profit'} ({(breakdown.B * 100).toFixed(0)}%)</span>
              <span>{formatToman(breakdown.totalProfit)}</span>
            </div>
            
            {breakdown.applyTax && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>{isFarsi ? 'مالیات بر ارزش افزوده' : 'VAT'} ({(breakdown.T * 100).toFixed(0)}%)</span>
                <span>{formatToman(breakdown.vatTotal)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">{isFarsi ? 'قیمت نهایی' : 'Total Price'}</span>
              <span className="font-bold text-3xl text-[#682535]">{formatToman(finalPrice)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <AddToCartButton 
              productId={product.id} 
              productName={productName} 
              productPrice={finalPrice} 
              productImage={images[0]} 
              stock={product.stock || 0} 
            />
            
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
          
          <p className={`text-sm text-center ${product.stock === 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
            {product.stock === 0 
              ? (isFarsi ? 'این محصول در حال حاضر ناموجود است.' : 'This product is currently out of stock.')
              : (isFarsi ? `فقط ${product.stock} عدد در انبار باقی مانده است.` : `Only ${product.stock} left in stock.`)
            }
          </p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-gray-100">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-8 text-center">
            {isFarsi ? 'محصولات بیشتر از این مجموعه' : 'More from this Collection'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {relatedProducts.map((relProduct) => {
              const relName = isFarsi ? relProduct.name_fa : relProduct.name_en;
              const relFinalPrice = calculateProductPrice(relProduct, settings);
              
              const relImage = relProduct.images && relProduct.images.length > 0 
                ? `http://127.0.0.1:8000/storage/${relProduct.images[0]}` 
                : '';
              
              return (
                <ProductCard 
                  key={relProduct.id} 
                  id={relProduct.id} 
                  name={relName} 
                  price={formatToman(relFinalPrice)} 
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