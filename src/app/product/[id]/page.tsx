"use client";

import { use, useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import { Star, Minus, Plus } from 'lucide-react';

// MOCK_DATA_START: Replace with API fetch based on product ID
const mockProducts = [
  {
    id: 1,
    nameEn: "Classic Gold Band",
    nameFa: "انگشتر طلای کلاسیک",
    categoryEn: "Rings",
    categoryFa: "انگشترها",
    descriptionEn: "A timeless 18k gold band, meticulously crafted for everyday elegance. Features a smooth, polished finish that pairs perfectly with any style.",
    descriptionFa: "یک انگشتر طلای ۱۸ عیار بی‌زمان، با دقت برای ظرافت روزمره ساخته شده است. دارای پرداخت صاف و صیقلی که به‌طور کامل با هر سبک هماهنگ می‌شود.",
    weight: 3.5,
    purity: "18k",
    makingCharges: 45,
    liveMetalPrice: 65,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: ["6", "7", "8", "9", "10"],
    rating: 4.8,
    reviewCount: 24,
  },
];
// MOCK_DATA_END

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const { id } = use(params);

  const product = mockProducts.find(p => p.id === Number(id)) || mockProducts[0];
  
  const productName = isFarsi ? product.nameFa : product.nameEn;
  const productCategory = isFarsi ? product.categoryFa : product.categoryEn;
  const productDescription = isFarsi ? product.descriptionFa : product.descriptionEn;

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  const totalPrice = (product.liveMetalPrice * product.weight * quantity) + (product.makingCharges * quantity);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-8">
        {t('home')} / {t('shop')} / {productCategory} / {productName}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden">
            <img 
              src={mainImage} 
              alt={productName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`aspect-square bg-gray-100 rounded-sm overflow-hidden border-2 transition-colors ${
                  mainImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">{productCategory}</p>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{productName}</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviewCount} {t('reviews').toLowerCase()})</span>
            </div>
          </div>

          {/* Dynamic Pricing Breakdown */}
          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 space-y-3">
            <h3 className="font-serif text-lg text-black mb-4">{t('totalPrice')}</h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('liveGoldPrice')} (${product.liveMetalPrice}/g)</span>
              <span>${(product.liveMetalPrice * product.weight * quantity).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('weight')} ({product.weight}g × {quantity})</span>
              <span>{product.weight * quantity}g</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t('makingCharges')}</span>
              <span>${product.makingCharges * quantity}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
              <span className="font-medium text-gray-900 text-lg">{t('totalPrice')}</span>
              <span className="font-serif text-2xl text-black">${totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {isFarsi ? '* قیمت پس از افزودن به سبد خرید ثابت می‌شود.' : '* Price is locked upon adding to cart.'}
            </p>
          </div>

          {/* Selectors */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">{t('size')}</p>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-sm text-sm transition-colors ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 text-gray-700 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button className="flex-grow bg-black text-white font-medium tracking-widest uppercase py-3 px-8 rounded-sm hover:bg-gray-800 transition-colors">
                {t('addToCart')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 pt-12">
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          {(['description', 'details', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium uppercase tracking-wider transition-colors relative ${
                activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t(tab)}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        <div className="max-w-3xl">
          {activeTab === 'description' && (
            <p className="text-gray-600 leading-relaxed">{productDescription}</p>
          )}
          
          {activeTab === 'details' && (
            <div className="text-gray-600">
              {/* Content will be added from backend */}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <button className="text-sm font-medium text-black underline underline-offset-4">
                {t('writeReview')}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}