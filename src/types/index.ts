export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  isPopular?: boolean;
  isFavorite?: boolean;
}

import type { ComponentProps } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export interface Category {
  id: string;
  name: string;
  icon: ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  gst: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  tableNumber?: string;
  restaurantInfo: RestaurantInfo;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Wallet';

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  gstNumber: string;
  currency: string;
  gstPercentage: number;
  receiptFooter: string;
}

export interface AppSettings {
  restaurantInfo: RestaurantInfo;
  darkMode: boolean;
  lastInvoiceNumber: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Billing: undefined;
  Cart: undefined;
  Payment: { grandTotal: number };
  Receipt: { invoiceId: string };
};

export type BottomTabParamList = {
  Home: undefined;
  Menu: undefined;
  History: undefined;
  Settings: undefined;
};
