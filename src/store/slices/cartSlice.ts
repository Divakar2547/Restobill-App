import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  discount: number;
  customerName: string;
  tableNumber: string;
}

const initialState: CartState = {
  items: [],
  discount: 0,
  customerName: '',
  tableNumber: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(i => i.product.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    increaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.product.id === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(i => i.product.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },
    setDiscount(state, action: PayloadAction<number>) {
      state.discount = Math.min(100, Math.max(0, action.payload));
    },
    setCustomerName(state, action: PayloadAction<string>) {
      state.customerName = action.payload;
    },
    setTableNumber(state, action: PayloadAction<string>) {
      state.tableNumber = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.discount = 0;
      state.customerName = '';
      state.tableNumber = '';
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setDiscount,
  setCustomerName,
  setTableNumber,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
