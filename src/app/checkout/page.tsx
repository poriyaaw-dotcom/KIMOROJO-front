"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Lock, MapPin, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GOLD_PRICE_PER_GRAM_TOMAN = 4500000;
const TAX_RATE = 0.10;

interface CartItem {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  making_charges: number;
  accessories_price?: number;
  images: string[] | null;
  quantity: number;
}

interface SavedAddress {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  // Profile fields (LOCKED - auto-filled from localStorage)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Editable fields
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // CHECK IF USER IS LOGGED IN
    const userPhone = localStorage.getItem('kimorojo_user_phone');
    if (!userPhone) {
      // Save where we want to redirect after login
      localStorage.setItem('redirect_after_login', '/checkout');
      router.push('/login');
      return;
    }

    // Load profile data
    const savedProfile = localStorage.getItem('kimorojo_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFirstName(parsed.firstName || '');
      setLastName(parsed.lastName || '');
    }

    const loadData = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem('kimorojo_cart') || '[]');
        if (localCart.length === 0) {
          router.push('/cart');
          return;
        }

        const res = await fetch('http://127.0.0.1:8000/api/products');
        const data = await res.json();
        const allProducts = data.data || [];

        const mergedCart: CartItem[] = localCart.map((localItem: any) => {
          const product = allProducts.find((p: any) => p.id === localItem.id);
          if (product) return { ...product, quantity: localItem.quantity };
          return null;
        }).filter(Boolean) as CartItem[];

        setCartItems(mergedCart);

        // Load saved addresses
        const addrRes = await fetch(`http://127.0.0.1:8000/api/addresses?phone=${encodeURIComponent(userPhone)}`);
        const addrData = await addrRes.json();
        const addresses = addrData.data || [];
        setSavedAddresses(addresses);
        
        const defaultAddr = addresses.find((a: SavedAddress) => a.is_default);
        if (defaultAddr) handleAddressSelect(defaultAddr);
      } catch (error) {
        console.error("Failed to load checkout data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const formatToman = (amount: number) => {
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(amount) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getItemPrice = (item: CartItem) => {
    const goldValue = GOLD_PRICE_PER_GRAM_TOMAN * item.weight;
    const makingCharges = item.making_charges || 0;
    const accessoriesPrice = item.accessories_price || 0;
    const subtotalItem = goldValue + makingCharges + accessoriesPrice;
    return subtotalItem + (subtotalItem * TAX_RATE);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const shipping = subtotal > 5000000 ? 0 : 150000;
  const total = subtotal + shipping;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddressSelect = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setPhone(addr.phone);
    setProvince(addr.province);
    setCity(addr.city);
    setAddress(addr.address);
    setPostalCode(addr.postal_code);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const userPhone = localStorage.getItem('kimorojo_user_phone');
    if (!userPhone) {
      alert(isFarsi ? 'لطفا وارد شوید' : 'Please login');
      router.push('/login');
      return;
    }

    try {
      let addressId = selectedAddressId;

      if (!addressId) {
        const addressPayload = {
          phone: userPhone,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          province,
          city,
          address,
          postal_code: postalCode,
          is_default: savedAddresses.length === 0
        };

        const addrRes = await fetch('http://127.0.0.1:8000/api/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addressPayload)
        });
        const addrData = await addrRes.json();
        addressId = addrData.data?.id;

        if (!addressId) throw new Error('Failed to save address');
      }

      const orderPayload = {
        phone: userPhone,
        address_id: addressId,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        tax: subtotal - (subtotal / 1.10),
        total
      };

      const orderRes = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (orderRes.ok) {
        localStorage.removeItem('kimorojo_cart');
        router.push('/checkout/success');
      } else {
        alert(isFarsi ? 'خطا در ثبت سفارش' : 'Failed to place order');
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(isFarsi ? 'خطایی رخ داد. لطفا دوباره تلاش کنید.' : 'An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <p className="text-gray-500">{isFarsi ? 'در حال بارگذاری...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">KIMOROJO</Link>
        <Link href="/cart" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">{t('cart') || 'Cart'}</Link>
      </div>

      <h1 className="text-3xl font-serif text-gray-900 mb-10 text-center md:text-left">{t('checkout') || 'Checkout'}</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          {savedAddresses.length > 0 && (
            <section className="bg-gray-50 p-6 rounded-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#682535]" />
                {isFarsi ? 'آدرس‌های ذخیره شده' : 'Saved Addresses'}
              </h2>
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#682535] bg-[#682535]/5' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input 
                      type="radio" 
                      name="savedAddress" 
                      checked={selectedAddressId === addr.id} 
                      onChange={() => handleAddressSelect(addr)}
                      className="mt-1 accent-[#682535]"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{addr.first_name} {addr.last_name} {addr.is_default && <span className="text-xs bg-[#682535] text-white px-2 py-0.5 rounded ml-2">{isFarsi ? 'پیش‌فرض' : 'Default'}</span>}</p>
                      <p className="text-gray-600 mt-1">{addr.province}, {addr.city}</p>
                      <p className="text-gray-600">{addr.address}</p>
                      <p className="text-gray-500 text-xs mt-1">{addr.postal_code} | {addr.phone}</p>
                    </div>
                  </label>
                ))}
                <button 
                  type="button" 
                  onClick={() => { setSelectedAddressId(null); setPhone(''); setProvince(''); setCity(''); setAddress(''); setPostalCode(''); }}
                  className="flex items-center gap-2 text-sm text-[#682535] hover:text-black transition-colors font-medium mt-2"
                >
                  <Plus className="w-4 h-4" />
                  {isFarsi ? 'استفاده از آدرس جدید' : 'Use a new address'}
                </button>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('shippingAddress') || 'Shipping Address'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'نام' : 'First Name'} *</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    disabled 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm bg-gray-100 text-gray-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'نام خانوادگی' : 'Last Name'} *</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    disabled 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm bg-gray-100 text-gray-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'شماره تماس' : 'Phone Number'} *</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  dir="ltr" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'استان' : 'Province'} *</label>
                  <input 
                    type="text" 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'شهر' : 'City'} *</label>
                  <input 
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'آدرس کامل' : 'Full Address'} *</label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  rows={3} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isFarsi ? 'کد پستی' : 'Postal Code'} *</label>
                <input 
                  type="text" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  dir="ltr" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                  required 
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 sticky top-24">
            <h2 className="font-serif text-lg text-black mb-6">{t('orderSummary') || 'Order Summary'} ({totalItems} {t('items') || 'items'})</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {cartItems.map((item) => {
                const itemName = isFarsi ? item.name_fa : item.name_en;
                const itemPrice = getItemPrice(item);
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{itemName} × {item.quantity}</span>
                    <span className="font-medium text-gray-900">{formatToman(itemPrice * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{isFarsi ? 'جمع کل' : 'Subtotal (incl. Tax)'}</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping') || 'Shipping'}</span>
                <span>{shipping === 0 ? (t('free') || 'Free') : formatToman(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900 text-base">{t('total') || 'Total'}</span>
                <span className="font-serif text-2xl text-[#682535] font-bold">{formatToman(total)}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="animate-pulse">{isFarsi ? 'در حال پردازش...' : 'Processing...'}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {t('placeOrder') || 'Place Order'}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              {t('secureCheckout') || 'Secure Checkout'}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}