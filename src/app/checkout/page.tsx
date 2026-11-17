"use client";

import Link from 'next/link';
import { useLang } from '@/context/LanguageContext';
import { Lock, MapPin, Plus, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calculateProductPrice } from '@/utils/calculatePrice';

interface CartItem {
  id: number;
  name_en: string;
  name_fa: string;
  weight: number;
  purity: string;
  metal_type: string;
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

interface Province {
  name_fa: string;
  name_en: string;
  cities: { name_fa: string; name_en: string }[];
}

export default function CheckoutPage() {
  const { t, lang } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState(''); 
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'card'>('online'); 
  
  // NEW: Tracking Code State
  const [trackingCode, setTrackingCode] = useState('');

  // Cascading Dropdown Data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [availableCities, setAvailableCities] = useState<{ name_fa: string; name_en: string }[]>([]);

  // Fetch settings, cart, and cities data
  useEffect(() => {
    const userPhone = localStorage.getItem('kimorojo_user_phone');
    const authToken = localStorage.getItem('kimorojo_auth_token');
    
    if (!userPhone || !authToken) {
      localStorage.setItem('redirect_after_login', '/checkout');
      router.push('/login');
      return;
    }

    const savedProfile = localStorage.getItem('kimorojo_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFirstName(parsed.firstName || '');
      setLastName(parsed.lastName || '');
    }

    // Fetch Settings
    fetch('https://admin.kimorojo.ir/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data.data || data))
      .catch(err => console.error("Failed to fetch settings", err));

    // Fetch Iran Cities
    fetch('/data/iran-cities.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Failed to load cities data", err));

    const loadData = async () => {
      try {
        const localCart = JSON.parse(localStorage.getItem('kimorojo_cart') || '[]');
        if (localCart.length === 0) {
          router.push('/cart');
          return;
        }

        const res = await fetch('https://admin.kimorojo.ir/api/products');
        const data = await res.json();
        const allProducts = data.data || [];

        const mergedCart: CartItem[] = localCart.map((localItem: any) => {
          const product = allProducts.find((p: any) => p.id === localItem.id);
          if (product) return { ...product, quantity: localItem.quantity };
          return null;
        }).filter(Boolean) as CartItem[];

        setCartItems(mergedCart);

        const addrRes = await fetch('https://admin.kimorojo.ir/api/addresses', {
          headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' }
        });
        const addrData = await addrRes.json();
        const addresses = addrData.data || [];
        setSavedAddresses(addresses);
        
        const defaultAddr = addresses.find((a: SavedAddress) => a.is_default);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setPhone(defaultAddr.phone);
          setProvince(defaultAddr.province);
          setCity(defaultAddr.city);
          setAddress(defaultAddr.address);
          setPostalCode(defaultAddr.postal_code);
        }
      } catch (error) {
        console.error("Failed to load checkout data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  // Handle Province Change -> Filter Cities
  const handleProvinceChange = (provName: string) => {
    setProvince(provName);
    setCity(''); // Reset city
    const selected = provinces.find(p => (isFarsi ? p.name_fa : p.name_en) === provName);
    if (selected) {
      setAvailableCities(selected.cities);
    } else {
      setAvailableCities([]);
    }
  };

  const formatToman = (amount: number) => {
    if (isNaN(amount) || amount === undefined || amount === null) return '0 ' + (isFarsi ? 'تومان' : 'Toman');
    const locale = isFarsi ? 'fa-IR' : 'en-US';
    return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
  };

  const getItemPrice = (item: CartItem) => {
    if (!settings) return 0;
    return calculateProductPrice(item, settings);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const shipping = 0;
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
    const authToken = localStorage.getItem('kimorojo_auth_token');

    if (!userPhone || !authToken) {
      alert(isFarsi ? 'لطفا وارد شوید' : 'Please login');
      router.push('/login');
      return;
    }

    // Validation for National ID
    if (!nationalId || nationalId.length !== 10) {
      alert(t('nationalIdRequired'));
      setIsProcessing(false);
      return;
    }

    // NEW: Validation for Tracking Code (Card to Card)
    if (paymentMethod === 'card' && !trackingCode.trim()) {
      alert(t('trackingCodeRequired'));
      setIsProcessing(false);
      return;
    }

    const getHeaders = (token: string) => ({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    try {
      let addressId = selectedAddressId;

      if (!addressId) {
        const addressPayload = {
          phone: userPhone,
          first_name: firstName || 'کاربر',
          last_name: lastName || 'کاربر',
          phone_number: phone,
          province,
          city,
          address,
          postal_code: postalCode,
          is_default: savedAddresses.length === 0
        };

        const addrRes = await fetch('https://admin.kimorojo.ir/api/addresses', {
          method: 'POST',
          headers: getHeaders(authToken),
          body: JSON.stringify(addressPayload)
        });
        
        const addrData = await addrRes.json();
        if (!addrRes.ok) throw new Error(addrData.message || 'Failed to save address');
        addressId = addrData.data?.id;
        if (!addressId) throw new Error('Failed to save address');
      }

      const orderPayload = {
        phone: userPhone,
        address_id: addressId,
        national_id: nationalId,
        payment_method: paymentMethod,
        tracking_code: trackingCode, // NEW: Send Tracking Code
        items: cartItems.map(item => ({
          product_id: parseInt(String(item.id), 10),
          quantity: item.quantity,
        })),
        subtotal,
        shipping,
        tax: 0,
        total
      };

      const orderRes = await fetch('https://admin.kimorojo.ir/api/orders', {
        method: 'POST',
        headers: getHeaders(authToken),
        body: JSON.stringify(orderPayload)
      });

      const orderData = await orderRes.json();

      if (orderRes.ok && orderData.success) {
        localStorage.removeItem('kimorojo_cart');
        router.push('/checkout/success');
      } else {
        console.error("Order failed:", orderData);
        alert(orderData.message || (isFarsi ? 'خطا در ثبت سفارش' : 'Failed to place order'));
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.message || (isFarsi ? 'خطایی رخ داد. لطفا دوباره تلاش کنید.' : 'An error occurred. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" dir={isFarsi ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="text-2xl font-serif tracking-[0.25em] text-black uppercase">KIMOROJO</Link>
        <Link href="/cart" className="text-sm text-gray-500 hover:text-black transition-colors underline underline-offset-4">{t('cart')}</Link>
      </div>

      <h1 className="text-3xl font-serif text-gray-900 mb-10 text-center md:text-left">{t('checkout')}</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-10">
          {savedAddresses.length > 0 && (
            <section className="bg-gray-50 p-6 rounded-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#682535]" />
                {t('savedAddresses')}
              </h2>
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#682535] bg-[#682535]/5' : 'border-gray-200 hover:border-gray-400'}`}>
                    <input type="radio" name="savedAddress" checked={selectedAddressId === addr.id} onChange={() => handleAddressSelect(addr)} className="mt-1 accent-[#682535]" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{addr.first_name} {addr.last_name} {addr.is_default && <span className="text-xs bg-[#682535] text-white px-2 py-0.5 rounded ml-2">{t('default')}</span>}</p>
                      <p className="text-gray-600 mt-1">{addr.province}, {addr.city}</p>
                      <p className="text-gray-600">{addr.address}</p>
                      <p className="text-gray-500 text-xs mt-1">{addr.postal_code} | {addr.phone}</p>
                    </div>
                  </label>
                ))}
                <button type="button" onClick={() => { setSelectedAddressId(null); setPhone(''); setProvince(''); setCity(''); setAddress(''); setPostalCode(''); }} className="flex items-center gap-2 text-sm text-[#682535] hover:text-black transition-colors font-medium mt-2">
                  <Plus className="w-4 h-4" /> {t('useNewAddress')}
                </button>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('shippingAddress')}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('firstName')} *</label>
                  <input type="text" value={firstName} disabled className="w-full px-4 py-3 border border-gray-200 rounded-sm bg-gray-100 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('lastName')} *</label>
                  <input type="text" value={lastName} disabled className="w-full px-4 py-3 border border-gray-200 rounded-sm bg-gray-100 text-gray-500" />
                </div>
              </div>
              
              {/* National ID Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('nationalId')} *</label>
                <input 
                  type="text" 
                  value={nationalId} 
                  onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} 
                  dir="ltr" 
                  placeholder={t('nationalIdPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneNumber')} *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" required />
              </div>
              
              {/* Cascading Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('province')} *</label>
                  <select 
                    value={province} 
                    onChange={(e) => handleProvinceChange(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white" 
                    required
                  >
                    <option value="">{t('selectProvince')}</option>
                    {provinces.map((p) => (
                      <option key={p.name_en} value={isFarsi ? p.name_fa : p.name_en}>
                        {isFarsi ? p.name_fa : p.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('city')} *</label>
                  <select 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white" 
                    required
                    disabled={!province}
                  >
                    <option value="">{t('selectCity')}</option>
                    {availableCities.map((c) => (
                      <option key={c.name_en} value={isFarsi ? c.name_fa : c.name_en}>
                        {isFarsi ? c.name_fa : c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullAddress')} *</label>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('postalCode')} *</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} dir="ltr" className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" required />
              </div>

              {/* Payment Method */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#682535]" />
                  {t('paymentMethod')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-[#682535] bg-[#682535]/5' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-[#682535]" />
                    <div className="text-sm font-medium text-gray-900">{t('payOnline')}</div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#682535] bg-[#682535]/5' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-[#682535]" />
                    <div className="text-sm font-medium text-gray-900">{t('payCardToCard')}</div>
                  </label>
                </div>
                
                {/* Card to Card Details & Tracking Code Input */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-sm text-sm text-gray-700 space-y-2">
                      <p className="font-medium">{t('cardToCardNote')}</p>
                      {settings.card_number ? (
                        <div className="mt-3 space-y-1 text-xs dir-ltr text-left">
                          <p><span className="font-semibold">{isFarsi ? 'نام بانک:' : 'Bank:'}</span> {isFarsi ? settings.card_bank_name_fa : settings.card_bank_name_en}</p>
                          <p><span className="font-semibold">{isFarsi ? 'صاحب حساب:' : 'Owner:'}</span> {isFarsi ? settings.card_owner_name_fa : settings.card_owner_name_en}</p>
                          <p><span className="font-semibold">{isFarsi ? 'شماره کارت:' : 'Card:'}</span> {settings.card_number}</p>
                          <p><span className="font-semibold">{isFarsi ? 'شبا:' : 'Sheba:'}</span> {settings.card_sheba}</p>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-red-500 italic">{isFarsi ? 'اطلاعات کارت توسط مدیریت تنظیم نشده است.' : 'Card details have not been configured by admin yet.'}</p>
                      )}
                    </div>
                    
                    {/* Tracking Code Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('trackingCode')} *</label>
                      <input 
                        type="text" 
                        value={trackingCode} 
                        onChange={(e) => setTrackingCode(e.target.value)} 
                        dir="ltr" 
                        placeholder={t('enterTrackingCode')}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-black transition-all" 
                        required 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 sticky top-24">
            <h2 className="font-serif text-lg text-black mb-6">{t('orderSummary')} ({totalItems} {t('items')})</h2>
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
                <span>{t('subtotal')}</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : formatToman(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-medium text-gray-900 text-base">{t('total')}</span>
                <span className="font-serif text-2xl text-[#682535] font-bold">{formatToman(total)}</span>
              </div>
            </div>
            <button type="submit" disabled={isProcessing} className="w-full bg-black text-white font-medium tracking-widest uppercase py-4 mt-8 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? <span className="animate-pulse">{t('processing')}</span> : <><Lock className="w-4 h-4" /> {t('placeOrder')}</>}
            </button>
            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" /> {t('secureCheckout')}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}