"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'fa';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

const translations = {
  en: {
    // --- General & Header ---
    searchPlaceholder: "Search jewelry...",
    shop: "Shop",
    contact: "Contact Us",
    about: "About Us",
    collections: "Collections", 
    cart: "Cart",
    favorites: "Favorites",
    profile: "Profile",
    viewAll: "View All",
    home: "Home",
    
    // --- Categories & Mega Menu ---
    rings: "Rings",
    necklaces: "Necklaces",
    bracelets: "Bracelets",
    earrings: "Earrings",
    charms: "Charms",
    jewelry: "Jewellery",
    necklacesDrop: "Necklaces",
    braceletsDrop: "Bracelets",
    ringsDrop: "Rings",
    earringsDrop: "Earrings",
    giftShop: "The Gift Shop",
    allGifts: "All Gifts",
    personalisedCharms: "Personalised Charms",
    zodiacCollection: "Zodiac Lab-Diamond collection",
    personalisedJewelry: "Personalised Jewellery",
    collectionsHeading: "Collections",
    everydayEssentials: "Everyday Essentials",
    statementPieces: "Statement Pieces",
    bestSellers: "Best Sellers",

    // --- Shop Page Filters & Sort ---
    sortBy: "Sort by",
    recommended: "Recommended",
    newest: "Newest",
    priceLowHigh: "Price (low to high)",
    priceHighLow: "Price (high to low)",
    categories: "Categories",
    allCategories: "All",
    metalType: "Metal Type",
    allMetals: "All",
    gold: "Gold",
    silver: "Silver",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",

    // --- Product Page ---
    size: "Size",
    addToCart: "Add to Cart",
    description: "Description",
    details: "Details",
    reviews: "Reviews",
    totalPrice: "Total Price",
    liveGoldPrice: "Live Gold Price",
    weight: "Weight",
    makingCharges: "Making Charges",
    writeReview: "Write a Review",
    inStock: "In Stock",
    outOfStock: "Out of Stock",

    // --- Cart Page ---
    emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    total: "Total",
    remove: "Remove",
    free: "Free",

    // --- Checkout & Auth (OTP) ---
    checkout: "Checkout",
    contactInfo: "Contact Information",
    shippingAddress: "Shipping Address",
    fullName: "Full Name",
    email: "Email Address",
    address: "Street Address",
    city: "City",
    postalCode: "Postal Code",
    phone: "Phone Number",
    placeOrder: "Place Order",
    secureCheckout: "Secure, encrypted checkout",
    login: "Login",
    enterPhone: "Please enter your phone number to continue",
    loginToCheckout: "Login to Checkout",
    continue: "Continue",
    enterOtp: "Enter the 5-digit code sent to your phone",
    verify: "Verify",
    resendCode: "Resend code",
    codeSentTo: "Code sent to",
    changeNumber: "Change number",

    // --- User Profile / Account ---
    myAccount: "My Account",
    orderHistory: "Order History",
    myAddresses: "My Addresses",
    orderNumber: "Order Number",
    date: "Date",
    status: "Status",
    totalAmount: "Total Amount",
    viewOrder: "View Order",
    delivered: "Delivered",
    processing: "Processing",
    shipped: "Shipped",
    addNewAddress: "Add New Address",
    defaultAddress: "Default Address",
    edit: "Edit",
    delete: "Delete",
    saveAddress: "Save Address",
    logout: "Log Out",

    // --- Favorites & Search (NEW) ---
    emptyFavorites: "Your favorites list is empty",
    searchResults: "Search Results for",
    noResults: "No products found matching your search",

    // --- Static Pages (NEW) ---
    aboutUs: "About Us",
    contactUs: "Contact Us",
    faq: "FAQ",
    shippingReturns: "Shipping & Returns",
    privacyPolicy: "Privacy Policy",
    sendMessage: "Send Message",
    messageSent: "Thank you! We will get back to you shortly.",
    name: "Name",
    message: "Message",
    askQuestion: "Ask a question",

    // --- Footer ---
    footerDesc: "Exquisite handcrafted jewelry for every moment.",
    quickLinks: "Quick Links",
    customerCare: "Customer Care",
    faq: "FAQ",
    privacy: "Privacy Policy",
    myProfile: "My Profile",
    copyright: "© 2026 KIMOROJO. All rights reserved.",
    designedBy: "Designed and developed by",
    aresTeam: "Ares Team",
    enamad: "E-Namad Trust Symbol",
  },
  fa: {
    // --- General & Header ---
    searchPlaceholder: "جستجوی جواهرات...",
    shop: "فروشگاه",
    contact: "تماس با ما",
    about: "درباره ما",
    collections: "مجموعه‌ها", 
    cart: "سبد خرید",
    favorites: "علاقه‌مندی‌ها",
    profile: "پروفایل",
    viewAll: "مشاهده همه",
    home: "خانه",
    
    // --- Categories & Mega Menu ---
    rings: "انگشترها",
    necklaces: "گردنبندها",
    bracelets: "دستبندها",
    earrings: "گوشواره‌ها",
    charms: "آویزها",
    jewelry: "جواهرات",
    necklacesDrop: "گردنبند",
    braceletsDrop: "دستبند",
    ringsDrop: "انگشتر",
    earringsDrop: "گوشواره",
    giftShop: "فروشگاه هدیه",
    allGifts: "همه هدایا",
    personalisedCharms: "آویزهای شخصی‌سازی شده",
    zodiacCollection: "مجموعه الماس آزمایشگاهی زودیاک",
    personalisedJewelry: "جواهرات شخصی‌سازی شده",
    collectionsHeading: "مجموعه‌ها",
    everydayEssentials: "ضروریات روزمره",
    statementPieces: "قطعات خاص",
    bestSellers: "پرفروش‌ترین‌ها",

    // --- Shop Page Filters & Sort ---
    sortBy: "مرتب‌سازی بر اساس",
    recommended: "پیشنهادی",
    newest: "جدیدترین",
    priceLowHigh: "قیمت (کم به زیاد)",
    priceHighLow: "قیمت (زیاد به کم)",
    categories: "دسته‌بندی‌ها",
    allCategories: "همه",
    metalType: "نوع فلز",
    allMetals: "همه",
    gold: "طلا",
    silver: "نقره",
    page: "صفحه",
    of: "از",
    previous: "قبلی",
    next: "بعدی",

    // --- Product Page ---
    size: "سایز",
    addToCart: "افزودن به سبد خرید",
    description: "توضیحات",
    details: "جزئیات",
    reviews: "نظرات",
    totalPrice: "قیمت کل",
    liveGoldPrice: "قیمت لحظه‌ای طلا",
    weight: "وزن",
    makingCharges: "اجرت ساخت",
    writeReview: "ثبت نظر",
    inStock: "موجود",
    outOfStock: "ناموجود",

    // --- Cart Page ---
    emptyCart: "سبد خرید شما خالی است",
    continueShopping: "ادامه خرید",
    orderSummary: "خلاصه سفارش",
    subtotal: "جمع کل",
    shipping: "هزینه ارسال",
    tax: "مالیات",
    total: "مجموع",
    remove: "حذف",
    free: "رایگان",

    // --- Checkout & Auth (OTP) ---
    checkout: "تسویه حساب",
    contactInfo: "اطلاعات تماس",
    shippingAddress: "آدرس ارسال",
    fullName: "نام و نام خانوادگی",
    email: "آدرس ایمیل",
    address: "آدرس خیابان",
    city: "شهر",
    postalCode: "کد پستی",
    phone: "شماره تلفن",
    placeOrder: "ثبت سفارش",
    secureCheckout: "پرداخت امن و رمزگذاری شده",
    login: "ورود",
    enterPhone: "لطفاً برای ادامه شماره تلفن خود را وارد کنید",
    loginToCheckout: "ورود به تسویه حساب",
    continue: "ادامه",
    enterOtp: "کد ۵ رقمی ارسال شده به تلفن خود را وارد کنید",
    verify: "تایید",
    resendCode: "ارسال مجدد کد",
    codeSentTo: "کد ارسال شد به",
    changeNumber: "تغییر شماره",

    // --- User Profile / Account ---
    myAccount: "حساب کاربری من",
    orderHistory: "تاریخچه سفارشات",
    myAddresses: "آدرس‌های من",
    orderNumber: "شماره سفارش",
    date: "تاریخ",
    status: "وضعیت",
    totalAmount: "مبلغ کل",
    viewOrder: "مشاهده سفارش",
    delivered: "تحویل داده شده",
    processing: "در حال پردازش",
    shipped: "ارسال شده",
    addNewAddress: "افزودن آدرس جدید",
    defaultAddress: "آدرس پیش‌فرض",
    edit: "ویرایش",
    delete: "حذف",
    saveAddress: "ذخیره آدرس",
    logout: "خروج",

    // --- Favorites & Search (NEW) ---
    emptyFavorites: "لیست علاقه‌مندی‌های شما خالی است",
    searchResults: "نتایج جستجو برای",
    noResults: "هیچ محصولی مطابق با جستجوی شما یافت نشد",

    // --- Static Pages (NEW) ---
    aboutUs: "درباره ما",
    contactUs: "تماس با ما",
    faq: "سوالات متداول",
    shippingReturns: "ارسال و بازگشت",
    privacyPolicy: "حریم خصوصی",
    sendMessage: "ارسال پیام",
    messageSent: "با تشکر! به زودی با شما تماس خواهیم گرفت.",
    name: "نام",
    message: "پیام",
    askQuestion: "سوال بپرسید",

    // --- Footer ---
    footerDesc: "جواهرات دست‌ساز بی‌نظیر برای هر لحظه.",
    quickLinks: "لینک‌های سریع",
    customerCare: "خدمات مشتریان",
    faq: "سوالات متداول",
    privacy: "حریم خصوصی",
    myProfile: "پروفایل من",
    copyright: "© ۲۰۲۶ کیموروجو. تمامی حقوق محفوظ است.",
    designedBy: "طراحی و توسعه توسط",
    aresTeam: "تیم آریس",
    enamad: "نماد اعتماد الکترونیکی",
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const t = (key: string) => {
    return translations[lang][key as keyof typeof translations.en] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within a LanguageProvider');
  return context;
};