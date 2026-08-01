import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings, RestaurantInfo } from '../../types';
import { DEFAULT_RESTAURANT } from '../../constants';

const initialState: AppSettings = {
  restaurantInfo: DEFAULT_RESTAURANT,
  darkMode: false,
  lastInvoiceNumber: 1000,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateRestaurantInfo(state, action: PayloadAction<RestaurantInfo>) {
      state.restaurantInfo = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    incrementInvoiceNumber(state) {
      state.lastInvoiceNumber += 1;
    },
    loadSettings(state, action: PayloadAction<AppSettings>) {
      return action.payload;
    },
  },
});

export const { updateRestaurantInfo, toggleDarkMode, setDarkMode, incrementInvoiceNumber, loadSettings } =
  settingsSlice.actions;
export default settingsSlice.reducer;
