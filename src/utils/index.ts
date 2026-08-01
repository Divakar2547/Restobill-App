import { CartItem, Invoice, PaymentMethod, RestaurantInfo } from '../types';

export const formatCurrency = (amount: number, currency = '₹'): string =>
  `${currency}${amount.toFixed(2)}`;

export const formatDate = (date: Date = new Date()): string =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (date: Date = new Date()): string =>
  date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

export const generateInvoiceNumber = (lastNumber: number): string =>
  `RB-${String(lastNumber + 1).padStart(5, '0')}`;

export const calculateGST = (amount: number, percentage: number): number =>
  parseFloat(((amount * percentage) / 100).toFixed(2));

export const calculateDiscount = (amount: number, percentage: number): number =>
  parseFloat(((amount * percentage) / 100).toFixed(2));

export const buildInvoice = (
  items: CartItem[],
  discount: number,
  gstPercentage: number,
  paymentMethod: PaymentMethod,
  restaurantInfo: RestaurantInfo,
  lastInvoiceNumber: number,
  customerName: string,
  tableNumber: string,
): Invoice => {
  const now = new Date();
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discountAmount = calculateDiscount(subtotal, discount);
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = calculateGST(taxableAmount, gstPercentage);
  const grandTotal = parseFloat((taxableAmount + gstAmount).toFixed(2));

  return {
    id: `inv_${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(lastInvoiceNumber),
    date: formatDate(now),
    time: formatTime(now),
    items,
    subtotal,
    discount,
    discountAmount,
    gst: gstPercentage,
    gstAmount,
    grandTotal,
    paymentMethod,
    customerName,
    tableNumber,
    restaurantInfo,
  };
};
