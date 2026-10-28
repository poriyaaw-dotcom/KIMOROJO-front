// src/utils/calculatePrice.ts

export interface PricingInput {
  weight: number | string;
  metal_type: string;
  making_charges: number | string;
  accessories_price?: number | string;
  accessories_making_charges?: number | string;
  accessories_profit?: number | string;
  apply_tax_on_accessories?: boolean | number;
}

export interface PricingSettings {
  gold_price: number | string;
  silver_price: number | string;
  seller_profit: number | string;
  tax_rate: number | string;
}

export function calculateProductPrice(
  product: PricingInput,
  settings?: PricingSettings
): number {
  const goldPrice = settings ? Number(settings.gold_price) : 26000000;
  const silverPrice = settings ? Number(settings.silver_price) : 4900000;
  
  // FIX: اگر ادمین عدد 9 وارد کرده، آن را به 0.09 تبدیل می‌کند. اگر اعشاری (مثل 0.1) وارد کرده، همان را نگه می‌دارد.
  const rawProfit = Number(settings?.seller_profit ?? 7);
  const profitRate = rawProfit > 1 ? rawProfit / 100 : rawProfit;

  const rawTax = Number(settings?.tax_rate ?? 10);
  const taxRate = rawTax > 1 ? rawTax / 100 : rawTax;

  const metalPrice = product.metal_type === 'silver' ? silverPrice : goldPrice;
  const weight = Number(product.weight) || 0;
  const makingChargesPercent = Number(product.making_charges || 0) / 100;

  const baseMetalValue = metalPrice * weight;
  const metalMakingCharges = baseMetalValue * makingChargesPercent;

  const accBase = Number(product.accessories_price || 0);
  const accMakingPercent = Number(product.accessories_making_charges || 0) / 100;
  const accProfitPercent = Number(product.accessories_profit || 0) / 100;
  const applyTax = Boolean(product.apply_tax_on_accessories);

  const accMakingCharges = accBase * accMakingPercent;
  const accProfit = (accBase + accMakingCharges) * accProfitPercent;

  const totalMakingCharges = metalMakingCharges + accMakingCharges;
  const metalProfit = (baseMetalValue + metalMakingCharges) * profitRate;
  const totalProfit = metalProfit + accProfit;

  let vatTotal = 0;
  if (applyTax) {
    vatTotal = (totalMakingCharges + totalProfit + accBase) * taxRate;
  } else {
    vatTotal = (metalMakingCharges + metalProfit) * taxRate;
  }

  return baseMetalValue + accBase + totalMakingCharges + totalProfit + vatTotal;
}

export function formatToman(amount: number, isFarsi: boolean): string {
  const locale = isFarsi ? 'fa-IR' : 'en-US';
  return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
}