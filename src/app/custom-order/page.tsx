"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/context/LanguageContext';
import { Upload, Check } from 'lucide-react';

export default function CustomOrderPage() {
  const { lang, t } = useLang();
  const isFarsi = lang === 'fa';
  const router = useRouter();

  const [jewelryType, setJewelryType] = useState('');
  const [metalType, setMetalType] = useState('');
  const [details, setDetails] = useState('');
  const [budget, setBudget] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('kimorojo_user_phone');
    if (!isLoggedIn) {
      router.push('/login?redirect=/custom-order');
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('jewelry_type', jewelryType);
    formData.append('metal_type', metalType);
    formData.append('details', details);
    if (budget) formData.append('budget', budget);
    if (image) formData.append('reference_image', image);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/custom-orders', {
        method: 'POST',
        body: formData,
        // Add auth headers here if your API requires a Bearer token
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        alert(isFarsi ? 'خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.' : 'Error submitting request. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(isFarsi ? 'خطا در ارتباط با سرور.' : 'Server communication error.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center" dir={isFarsi ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 bg-[#682535]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#682535]" />
        </div>
        <h2 className="text-3xl font-serif text-gray-900 mb-4">
          {isFarsi ? 'درخواست شما با موفقیت ثبت شد!' : 'Your Request Has Been Submitted!'}
        </h2>
        <p className="text-gray-600 mb-8">
          {isFarsi 
            ? 'تیم ما به زودی درخواست شما را بررسی کرده و برای هماهنگی بیشتر با شما تماس خواهد گرفت.' 
            : 'Our team will review your request shortly and contact you for further coordination.'}
        </p>
        <button 
          onClick={() => router.push('/')} 
          className="bg-[#682535] text-white px-8 py-3 text-sm font-medium tracking-widest uppercase hover:bg-[#501d29] transition-colors"
        >
          {isFarsi ? 'بازگشت به خانه' : 'Return Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16" dir={isFarsi ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2 text-center">
        {isFarsi ? 'سفارش اختصاصی' : 'Custom Order'}
      </h1>
      <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
        {isFarsi 
          ? 'جزئیات جواهر رویایی خود را برای ما توصیف کنید. تیم ما آن را برای شما به واقعیت تبدیل خواهد کرد.' 
          : 'Describe your dream jewelry to us. Our team will bring it to life for you.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Jewelry Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {isFarsi ? 'نوع زیورآلات' : 'Jewelry Type'} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'ring', label: isFarsi ? 'انگشتر' : 'Ring' },
              { id: 'necklace', label: isFarsi ? 'گردنبند' : 'Necklace' },
              { id: 'bracelet', label: isFarsi ? 'دستبند' : 'Bracelet' },
              { id: 'earring', label: isFarsi ? 'گوشواره' : 'Earring' },
              { id: 'other', label: isFarsi ? 'سایر' : 'Other' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setJewelryType(item.id)}
                className={`py-3 px-4 rounded-sm border text-sm font-medium transition-all duration-200 ${
                  jewelryType === item.id
                    ? 'border-[#682535] bg-[#682535] text-white'
                    : 'border-gray-200 text-gray-700 hover:border-[#682535] hover:text-[#682535]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Metal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {isFarsi ? 'نوع فلز' : 'Metal Type'} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { id: 'gold_18k', label: isFarsi ? 'طلای ۱۸ عیار' : '18k Gold' },
              { id: 'silver_925', label: isFarsi ? 'نقره ۹۲۵' : '925 Silver' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMetalType(item.id)}
                className={`py-3 px-4 rounded-sm border text-sm font-medium transition-all duration-200 ${
                  metalType === item.id
                    ? 'border-[#682535] bg-[#682535] text-white'
                    : 'border-gray-200 text-gray-700 hover:border-[#682535] hover:text-[#682535]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reference Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {isFarsi ? 'تصویر مرجع (اختیاری)' : 'Reference Image (Optional)'}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:border-[#682535] transition-colors relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-sm object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-sm">{isFarsi ? 'برای آپلود کلیک کنید یا فایل را بکشید' : 'Click to upload or drag and drop'}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {isFarsi ? 'جزئیات و توضیحات' : 'Details & Description'} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={isFarsi ? 'مدل، نوع سنگ، حکاکی، متعلقات یا هر جزئیات دیگری که مد نظر دارید...' : 'Model, stone type, engraving, accessories, or any other details you have in mind...'}
            className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#682535] focus:border-[#682535] transition-colors"
          />
        </div>

        {/* 5. Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {isFarsi ? 'بودجه تقریبی (تومان) - اختیاری' : 'Approximate Budget (Toman) - Optional'}
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={isFarsi ? 'مثال: 5000000' : 'e.g., 5000000'}
            className="w-full md:w-1/2 px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#682535] focus:border-[#682535] transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !jewelryType || !metalType || !details}
          className="w-full md:w-auto bg-[#682535] text-white px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-[#501d29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (isFarsi ? 'در حال ارسال...' : 'Submitting...') : (isFarsi ? 'ارسال درخواست' : 'Submit Request')}
        </button>
      </form>
    </div>
  );
}