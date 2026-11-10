"use client";

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import Link from 'next/link';
import { ArrowLeft, Heart, ZoomIn, X, Maximize2 } from 'lucide-react';
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
  images: string[] | string | null;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
  category: { slug: string; name_en: string; name_fa: string } | null;
  collection: { slug: string; name_en: string; name_fa: string } | null;
}

const getSafeImages = (images: string[] | string | null | undefined): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [images];
    } catch (e) {
      return [images];
    }
  }
  return [];
};

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

  // States for Full-Screen Modal & Touch Zoom
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScale, setModalScale] = useState(1);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const [startDist, setStartDist] = useState(0);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const productName = isFarsi ? product.name_fa : product.name_en;
  const productDesc = isFarsi ? product.description_fa : product.description_en;
  const isFav = isFavorite(product.id);
  
  const parsedImages = getSafeImages(product.images);
  const images = parsedImages.length > 0 
    ? parsedImages.map(img => `https://admin.kimorojo.ir/storage/${img}`)
    : ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80'];

  const finalPrice = calculateProductPrice(product, settings);

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

  // Desktop Wheel Zoom Logic
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

  // Mobile Touch Zoom & Pan Logic
  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setStartDist(getDistance(e.touches));
    } else if (e.touches.length === 1) {
      setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const currentDist = getDistance(e.touches);
      const scaleChange = currentDist / startDist;
      setModalScale((prev) => Math.min(Math.max(prev * scaleChange, 1), 5));
      setStartDist(currentDist);
    } else if (e.touches.length === 1 && modalScale > 1) {
      const dx = e.touches[0].clientX - startPos.x;
      const dy = e.touches[0].clientY - startPos.y;
      setModalPos((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    if (modalScale <= 1.1) {
      setModalScale(1);
      setModalPos({ x: 0, y: 0 });
    }
  };

  const openModal = () => {
    setModalScale(1);
    setModalPos({ x: 0, y: 0 });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalScale(1);
    setModalPos({ x: 0, y: 0 });
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
            className="aspect-square bg-gray-100 rounded-sm overflow-hidden relative cursor-zoom-in group"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={openModal}
          >
            <img 
              src={images[selectedImage]} 
              alt={productName} 
              className="w-full h-full object-cover transition-transform duration-200 ease-out"
              style={{ transform: `scale(${scale})`, transformOrigin: `${position.x}% ${position.y}%` }}
            />
            
            <div className="absolute top-4 right-4 md:hidden bg-black/50 text-white p-2 rounded-full pointer-events-none backdrop-blur-sm">
              <Maximize2 className="w-5 h-5" />
            </div>

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

          <div className="text-center md:text-start p-4 bg-[#FAF0E6] rounded-lg">
            <div className="flex items-center justify-between gap-4">
              {product.metal_type === 'silver' ? (
                <p className="text-base font-bold text-gray-800">
                  {isFarsi 
                    ? `قیمت لحظه‌ای نقره: ${formatToman(Number(settings.silver_price)).replace(' تومان', '')} / گرم` 
                    : `Live Silver Price: ${formatToman(Number(settings.silver_price)).replace(' Toman', '')} / g`}
                </p>
              ) : (
                <p className="text-base font-bold text-gray-800">
                  {isFarsi 
                    ? `قیمت لحظه‌ای طلا: ${formatToman(Number(settings.gold_price)).replace(' تومان', '')} / گرم` 
                    : `Live Gold Price: ${formatToman(Number(settings.gold_price)).replace(' Toman', '')} / g`}
                </p>
              )}
              
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {isFarsi 
                  ? `به‌روزرسانی: ${formattedTime}` 
                  : `Updated: ${formattedTime}`}
              </span>
            </div>
          </div>

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
              
              const relParsedImages = getSafeImages(relProduct.images);
              const relImage = relParsedImages.length > 0 
                ? `https://admin.kimorojo.ir/storage/${relParsedImages[0]}` 
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

      {/* FULL-SCREEN IMAGE MODAL (Mobile & Desktop) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          onClick={closeModal}
        >
          <div className="flex justify-between items-center p-4 text-white">
            <span className="text-sm font-medium truncate pr-4">{productName}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); closeModal(); }}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div 
            className="flex-1 flex items-center justify-center overflow-hidden touch-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={images[selectedImage]} 
              alt={productName}
              className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out"
              style={{ 
                transform: `translate(${modalPos.x}px, ${modalPos.y}px) scale(${modalScale})` 
              }}
            />
          </div>

          {images.length > 1 && (
            <div className="p-4 flex gap-3 overflow-x-auto justify-center bg-black/50">
              {images.map((img, index) => (
                <button 
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                    setModalScale(1);
                    setModalPos({ x: 0, y: 0 });
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-white' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}