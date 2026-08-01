import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BillingState {
  selectedCategory: string;
  searchQuery: string;
}

const initialState: BillingState = {
  selectedCategory: 'all',
  searchQuery: '',
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetBillingFilters(state) {
      state.selectedCategory = 'all';
      state.searchQuery = '';
    },
  },
});

export const { setSelectedCategory, setSearchQuery, resetBillingFilters } = billingSlice.actions;
export default billingSlice.reducer;
