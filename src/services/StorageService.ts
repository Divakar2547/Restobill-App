import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Invoice } from '../types';

const KEYS = {
  SETTINGS: '@restrobill_settings',
  INVOICES: '@restrobill_invoices',
};

export const StorageService = {
  async saveSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  async loadSettings(): Promise<AppSettings | null> {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? (JSON.parse(data) as AppSettings) : null;
  },

  async saveInvoices(invoices: Invoice[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },

  async loadInvoices(): Promise<Invoice[]> {
    const data = await AsyncStorage.getItem(KEYS.INVOICES);
    return data ? (JSON.parse(data) as Invoice[]) : [];
  },
};
