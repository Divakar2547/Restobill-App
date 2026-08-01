import { configureStore } from '@reduxjs/toolkit';
import billingReducer from './slices/billingSlice';
import cartReducer from './slices/cartSlice';
import invoiceReducer from './slices/invoiceSlice';
import paymentReducer from './slices/paymentSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    billing: billingReducer,
    cart: cartReducer,
    invoice: invoiceReducer,
    payment: paymentReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
