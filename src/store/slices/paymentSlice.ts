import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentMethod } from '../../types';

interface PaymentState {
  selectedMethod: PaymentMethod;
  isProcessing: boolean;
}

const initialState: PaymentState = {
  selectedMethod: 'Cash',
  isProcessing: false,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.selectedMethod = action.payload;
    },
    setProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload;
    },
    resetPayment(state) {
      state.selectedMethod = 'Cash';
      state.isProcessing = false;
    },
  },
});

export const { setPaymentMethod, setProcessing, resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
