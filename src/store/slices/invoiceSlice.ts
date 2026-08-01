import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Invoice } from '../../types';

interface InvoiceState {
  invoices: Invoice[];
}

const initialState: InvoiceState = { invoices: [] };

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    addInvoice(state, action: PayloadAction<Invoice>) {
      state.invoices.unshift(action.payload);
    },
    loadInvoices(state, action: PayloadAction<Invoice[]>) {
      state.invoices = action.payload;
    },
    clearInvoices(state) {
      state.invoices = [];
    },
  },
});

export const { addInvoice, loadInvoices, clearInvoices } = invoiceSlice.actions;
export default invoiceSlice.reducer;
