"use client";

import { useState } from 'react';
import { useLang } from '@/context/LanguageContext';
import StaticPageLayout from '@/components/StaticPageLayout';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  questionEn: string;
  answerEn: string;
  questionFa: string;
  answerFa: string;
}

const faqData: FaqItem[] = [
  {
    questionEn: "How are product prices calculated?",
    answerEn: "The price of each product is calculated based on the type and weight of the metal, purity, making charges, the value of stones or materials used, and legal fees. Details regarding weight, purity, and specifications are listed on each product's page.",
    questionFa: "قیمت محصولات چگونه محاسبه می‌شود؟",
    answerFa: "قیمت هر محصول بر اساس نوع و وزن فلز، عیار، اجرت ساخت، ارزش سنگ یا متریال استفاده‌شده و هزینه‌های قانونی محاسبه می‌شود. جزئیات مربوط به وزن، عیار و مشخصات هر قطعه در صفحه همان محصول درج شده است."
  },
  {
    questionEn: "Do product prices change with gold and silver rates?",
    answerEn: "Yes. The price of some products is updated according to the daily gold and silver rates. The final order price is the amount displayed at the time of checkout and payment.",
    questionFa: "آیا قیمت محصولات با تغییر نرخ طلا و نقره تغییر می‌کند؟",
    answerFa: "بله. قیمت بعضی محصولات با توجه به نرخ روز طلا و نقره به‌روزرسانی می‌شود. قیمت نهایی سفارش، مبلغی است که هنگام ثبت و پرداخت سفارش در سایت نمایش داده می‌شود."
  },
  {
    questionEn: "Is an invoice provided with the product?",
    answerEn: "Yes. Gold and silver products are provided with a purchase invoice. Specifications such as metal type, purity, weight, and the amount paid will be included in the invoice.",
    questionFa: "آیا همراه محصول فاکتور ارائه می‌شود؟",
    answerFa: "بله. محصولات طلا و نقره همراه با فاکتور خرید ارائه می‌شوند. مشخصاتی مانند نوع فلز، عیار، وزن و مبلغ پرداخت‌شده در فاکتور درج خواهد شد."
  },
  {
    questionEn: "How can we be sure of the authenticity of gold or silver?",
    answerEn: "The metal and purity specifications of each product are written on its page and recorded in the invoice upon purchase. KIMOROJO products are supplied according to the specifications stated on the website.",
    questionFa: "چگونه از اصالت طلا یا نقره مطمئن شویم؟",
    answerFa: "مشخصات فلز و عیار هر محصول در صفحه آن نوشته شده و هنگام خرید نیز در فاکتور ثبت می‌شود. محصولات KIMOROJO مطابق با مشخصات اعلام‌شده در سایت عرضه می‌شوند."
  },
  {
    questionEn: "Might the final weight of the product differ from the listed weight?",
    answerEn: "Due to the manufacturing and final finishing process, there may be a slight difference in the weight of some pieces. If this difference affects the order amount, the final price will be calculated and communicated to the buyer before shipping.",
    questionFa: "آیا وزن نهایی محصول ممکن است با وزن درج‌شده متفاوت باشد؟",
    answerFa: "به دلیل فرایند ساخت و پرداخت نهایی، امکان اختلاف جزئی در وزن بعضی قطعات وجود دارد. در صورت تأثیر این اختلاف بر مبلغ سفارش، قیمت نهایی پیش از ارسال محاسبه و به خریدار اطلاع داده می‌شود."
  },
  {
    questionEn: "Is it possible to resize rings?",
    answerEn: "The possibility of resizing depends on the model, structure, and setting of the ring. Please check the size guide before placing an order, or contact us for advice.",
    questionFa: "آیا امکان تغییر سایز انگشتر وجود دارد؟",
    answerFa: "امکان تغییر سایز به مدل، ساختار و نوع سنگ‌گذاری انگشتر بستگی دارد. لطفاً پیش از ثبت سفارش، راهنمای تعیین سایز را بررسی کنید یا برای دریافت مشاوره با ما در ارتباط باشید."
  },
  {
    questionEn: "Can products be customized?",
    answerEn: "In some models, it is possible to change the size, metal type, gold color, stone, engraving, or design details. Available options are shown on the product page; for further changes, you can place a custom order.",
    questionFa: "آیا محصولات امکان شخصی‌سازی دارند؟",
    answerFa: "در بعضی مدل‌ها امکان تغییر سایز، نوع فلز، رنگ طلا، سنگ، حکاکی یا جزئیات طراحی وجود دارد. گزینه‌های قابل تغییر در صفحه محصول نمایش داده می‌شوند؛ برای تغییرات بیشتر می‌توانید درخواست سفارش اختصاصی ثبت کنید."
  },
  {
    questionEn: "How is a custom order placed?",
    answerEn: "On the 'Custom Order' page, you can submit your descriptions, reference images, metal type, approximate budget, and other details. After reviewing the request, we will contact you for consultation and to announce the production terms.",
    questionFa: "سفارش اختصاصی چگونه ثبت می‌شود؟",
    answerFa: "در صفحه «سفارش اختصاصی» می‌توانید توضیحات، تصاویر مرجع، نوع فلز، بودجه تقریبی و سایر جزئیات موردنظر خود را ارسال کنید. پس از بررسی درخواست، برای مشاوره و اعلام شرایط ساخت با شما تماس گرفته می‌شود."
  },
  {
    questionEn: "What are the steps for a custom order?",
    answerEn: "After receiving the request, we coordinate with you regarding the idea, budget, and technical specifications. Then, the initial design is prepared, and upon your approval, the material selection and production stages begin. Major changes after final design approval may incur extra costs and time.",
    questionFa: "مراحل ساخت سفارش اختصاصی چیست؟",
    answerFa: "پس از دریافت درخواست، درباره ایده، بودجه و مشخصات فنی با شما هماهنگ می‌کنیم. سپس طراحی اولیه آماده می‌شود و پس از تأیید شما، مراحل انتخاب متریال و ساخت آغاز خواهد شد. تغییرات اساسی پس از تأیید نهایی طراحی ممکن است شامل هزینه و زمان اضافه باشد."
  },
  {
    questionEn: "How long does a custom order take?",
    answerEn: "The preparation time depends on the design complexity, material type, stone setting, and workshop workload. The approximate production time will be announced to you before work begins.",
    questionFa: "ساخت سفارش اختصاصی چقدر زمان می‌برد؟",
    answerFa: "زمان آماده‌سازی به پیچیدگی طراحی، نوع متریال، سنگ‌گذاری و حجم سفارش‌های کارگاه بستگی دارد. مدت تقریبی ساخت پیش از شروع کار به شما اعلام می‌شود."
  },
  {
    questionEn: "Can I send a picture of a jewelry piece from another brand to be made?",
    answerEn: "Images can be used to determine your taste, form, or desired style; however, designs of brands and works with intellectual property are not copied exactly. The final design will be done with an independent identity tailored to your wishes.",
    questionFa: "آیا می‌توانم تصویر یک زیور از برند دیگری را برای ساخت ارسال کنم؟",
    answerFa: "تصاویر می‌توانند برای مشخص‌کردن سلیقه، فرم یا سبک موردنظر شما استفاده شوند؛ اما طرح برندها و آثار دارای مالکیت معنوی عیناً کپی نمی‌شوند. طراحی نهایی با هویت مستقل و متناسب با خواسته شما انجام خواهد شد."
  },
  {
    questionEn: "Is it possible to cancel a custom order?",
    answerEn: "Cancellation is possible according to the stated conditions before design or production begins. After design, material procurement, or production starts, the cost of completed stages and purchased materials will be deducted from the paid amount.",
    questionFa: "آیا امکان لغو سفارش اختصاصی وجود دارد؟",
    answerFa: "تا پیش از شروع طراحی یا ساخت، لغو سفارش مطابق شرایط اعلام‌شده امکان‌پذیر است. پس از آغاز طراحی، تهیه مواد یا ساخت، هزینه مراحل انجام‌شده و متریال تهیه‌شده از مبلغ پرداختی کسر خواهد شد."
  },
  {
    questionEn: "Is it possible to exchange or return products?",
    answerEn: "Exchange or return requests for ready-made products are handled after inspecting the item and in accordance with KIMOROJO's return policies. The product must be unused, intact, and accompanied by its packaging, invoice, and full accessories. Custom, engraved, or resized products are only reviewed if there is a proven manufacturing defect.",
    questionFa: "آیا امکان تعویض یا مرجوع‌کردن محصولات وجود دارد؟",
    answerFa: "درخواست تعویض یا مرجوعی محصولات آماده، پس از بررسی وضعیت کالا و مطابق با قوانین مرجوعی KIMOROJO انجام می‌شود. محصول باید استفاده‌نشده، سالم و همراه با بسته‌بندی، فاکتور و متعلقات کامل باشد. محصولات سفارشی، حکاکی‌شده یا تغییرسایزداده‌شده تنها در صورت وجود ایراد قابل اثبات در ساخت بررسی می‌شوند."
  },
  {
    questionEn: "What should I do if the product is damaged upon delivery?",
    answerEn: "Please check the package immediately upon receipt. If you notice damage, discrepancy, or defect, take clear photos before using the product and contact us via the site's communication channels.",
    questionFa: "اگر محصول هنگام تحویل آسیب‌دیده باشد چه کاری انجام دهم؟",
    answerFa: "لطفاً بلافاصله پس از دریافت بسته، وضعیت آن را بررسی کنید. در صورت مشاهده آسیب، مغایرت یا نقص، پیش از استفاده از محصول تصاویر واضح تهیه کرده و از طریق راه‌های ارتباطی سایت با ما تماس بگیرید."
  },
  {
    questionEn: "How are orders shipped?",
    answerEn: "Orders are sent via the chosen shipping method after final inspection and secure packaging. Shipping time and cost are displayed during checkout, and a tracking code will be sent to you if available.",
    questionFa: "سفارش‌ها چگونه ارسال می‌شوند؟",
    answerFa: "سفارش‌ها پس از کنترل نهایی و بسته‌بندی ایمن، از طریق روش ارسال انتخاب‌شده فرستاده می‌شوند. زمان و هزینه ارسال هنگام ثبت سفارش نمایش داده می‌شود و در صورت وجود کد رهگیری، برای شما ارسال خواهد شد."
  },
  {
    questionEn: "Is shipping available throughout Iran?",
    answerEn: "Yes, shipping is available to various cities in Iran. Shipping conditions, approximate delivery time, and potential regional restrictions will be specified during checkout.",
    questionFa: "آیا امکان ارسال به سراسر ایران وجود دارد؟",
    answerFa: "بله، ارسال به شهرهای مختلف ایران انجام می‌شود. شرایط ارسال، زمان تقریبی تحویل و محدودیت‌های احتمالی هر منطقه هنگام ثبت سفارش مشخص خواهد شد."
  },
  {
    questionEn: "Is cash on delivery available?",
    answerEn: "Due to the value and nature of gold and silver products, orders are prepared and shipped after payment and final confirmation. Active payment methods will be displayed at checkout.",
    questionFa: "آیا امکان پرداخت در محل وجود دارد؟",
    answerFa: "به دلیل ارزش و ماهیت محصولات طلا و نقره، سفارش‌ها پس از پرداخت و تأیید نهایی آماده و ارسال می‌شوند. روش‌های پرداخت فعال در مرحله تسویه‌حساب نمایش داده خواهند شد."
  },
  {
    questionEn: "How should I store and clean my jewelry?",
    answerEn: "To protect your jewelry, it is best to keep each piece separately in its box or a special pouch, and use a soft cloth for cleaning.",
    questionFa: "چگونه از جواهرات خود نگهداری و تمیزکاری کنم؟",
    answerFa: "برای محافظت از جواهرات، بهتر است هر قطعه را جداگانه در جعبه یا کیسه مخصوص نگهداری کرده و برای تمیزکاری از دستمال نرم استفاده کنید."
  },
  {
    questionEn: "Is tarnishing of silver natural?",
    answerEn: "Yes. Silver may darken over time when exposed to air, humidity, sweat, or chemicals. This change usually does not mean a decrease in quality or authenticity and can be resolved with specialized cleaning.",
    questionFa: "آیا تغییر رنگ نقره طبیعی است؟",
    answerFa: "بله. نقره ممکن است در تماس با هوا، رطوبت، تعریق یا مواد شیمیایی به‌مرور تیره شود. این تغییر معمولاً به معنی کاهش کیفیت یا اصالت نقره نیست و با تمیزکاری تخصصی قابل برطرف‌شدن است."
  },
  {
    questionEn: "How can I contact KIMOROJO?",
    answerEn: "You can contact us via the site's contact form, custom order page, support number, or KIMOROJO's official social media. Valid contact information is listed in the 'Contact Us' section.",
    questionFa: "چگونه با KIMOROJO ارتباط بگیرم؟",
    answerFa: "می‌توانید از طریق فرم تماس سایت، صفحه سفارش اختصاصی، شماره پشتیبانی یا شبکه‌های اجتماعی رسمی KIMOROJO با ما در ارتباط باشید. اطلاعات تماس معتبر در بخش «ارتباط با ما» درج شده است."
  }
];

export default function FaqPage() {
  const { lang } = useLang();
  const isFarsi = lang === 'fa';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <StaticPageLayout titleKey="faq">
      <div className="max-w-3xl mx-auto space-y-2" dir={isFarsi ? 'rtl' : 'ltr'}>
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-100">
            <button
              onClick={() => toggleQuestion(index)}
              className={`w-full flex items-center justify-between py-5 text-left transition-colors hover:text-[#682535] ${
                isFarsi ? 'text-right' : 'text-left'
              } ${openIndex === index ? 'text-[#682535]' : 'text-gray-900'}`}
            >
              <span className="font-serif text-lg font-medium">
                {isFarsi ? faq.questionFa : faq.questionEn}
              </span>
              <ChevronDown 
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="text-gray-600 leading-relaxed">
                {isFarsi ? faq.answerFa : faq.answerEn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}