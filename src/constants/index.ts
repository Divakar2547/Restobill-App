import { RestaurantInfo } from '../types';

export const DEFAULT_RESTAURANT: RestaurantInfo = {
  name: 'RestroBill Kitchen',
  address: '42, Food Street, MG Road, Bangalore - 560001',
  phone: '+91 98765 43210',
  gstNumber: '29ABCDE1234F1Z5',
  currency: '₹',
  gstPercentage: 5,
  receiptFooter: 'Thank you for dining with us! Visit again ❤️',
};

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Wallet'] as const;
