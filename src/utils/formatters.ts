import { CurrencyConfig, Quote } from '../types';

export function formatCurrency(amount: number, currency: CurrencyConfig): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  
  // Format with thousands separator and specified decimals
  const formattedNumber = new Intl.NumberFormat('es-CR', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(safeAmount);

  if (currency.placement === 'suffix') {
    return `${formattedNumber} ${currency.symbol}`;
  }
  return `${currency.symbol} ${formattedNumber}`;
}

export interface QuoteCalculations {
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalWithDiscount: number;
  ivaRate: number;
  ivaAmount: number;
  grandTotal: number;
}

export function calculateQuoteTotals(quote: Quote): QuoteCalculations {
  const subtotal = quote.items.reduce((sum, item) => {
    const itemTotal = item.isPriceManual ? (item.total || 0) : ((item.quantity || 1) * (item.unitPrice || 0));
    return sum + itemTotal;
  }, 0);

  const discountPercentage = quote.applyDiscount ? (quote.discountPercentage || 0) : 0;
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const totalWithDiscount = Math.max(0, subtotal - discountAmount);

  const ivaRate = quote.includeIva ? (quote.ivaRate || 13) : 0;
  const ivaAmount = Math.round((totalWithDiscount * ivaRate) / 100);
  const grandTotal = totalWithDiscount + ivaAmount;

  return {
    subtotal,
    discountPercentage,
    discountAmount,
    totalWithDiscount,
    ivaRate,
    ivaAmount,
    grandTotal
  };
}
