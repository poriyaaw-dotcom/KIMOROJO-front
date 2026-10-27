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
  // Use provided settings or defaults
  const goldPrice = settings ? Number(settings.gold_price) : 26000000;
  const silverPrice = settings ? Number(settings.silver_price) : 4900000;
  const profitRate = settings ? Number(settings.seller_profit) : 0.07;
  const taxRate = settings ? Number(settings.tax_rate) : 0.10;

  // 1. Determine metal price
  const metalPrice = product.metal_type === 'silver' ? silverPrice : goldPrice;
  const weight = Number(product.weight) || 0;
  const makingChargesPercent = Number(product.making_charges || 0) / 100;

  // 2. Base Metal Value
  const baseMetalValue = metalPrice * weight;

  // 3. Making Charges
  const metalMakingCharges = baseMetalValue * makingChargesPercent;

  // 4. Accessories
  const accBase = Number(product.accessories_price || 0);
  const accMakingPercent = Number(product.accessories_making_charges || 0) / 100;
  const accProfitPercent = Number(product.accessories_profit || 0) / 100;
  const applyTax = Boolean(product.apply_tax_on_accessories);

  const accMakingCharges = accBase * accMakingPercent;
  const accProfit = (accBase + accMakingCharges) * accProfitPercent;

  // 5. Totals
  const totalMakingCharges = metalMakingCharges + accMakingCharges;
  const metalProfit = (baseMetalValue + metalMakingCharges) * profitRate;
  const totalProfit = metalProfit + accProfit;

  // 6. VAT Calculation
  let vatTotal = 0;
  if (applyTax) {
    vatTotal = (totalMakingCharges + totalProfit + accBase) * taxRate;
  } else {
    vatTotal = (metalMakingCharges + metalProfit) * taxRate;
  }

  // 7. Final Price
  return baseMetalValue + accBase + totalMakingCharges + totalProfit + vatTotal;
}

// Helper to format price in Toman
export function formatToman(amount: number, isFarsi: boolean): string {
  const locale = isFarsi ? 'fa-IR' : 'en-US';
  return new Intl.NumberFormat(locale).format(Math.round(amount)) + ' ' + (isFarsi ? 'تومان' : 'Toman');
}