import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { StorageService } from './services/StorageService';
import { loadSettings, setDarkMode } from './store/slices/settingsSlice';
import { RootState } from './store';
import { loadInvoices } from './store/slices/invoiceSlice';
import { AppDispatch } from './store';
import RootNavigator from './navigation/RootNavigator';
import { Colors, setThemeMode } from './theme';

// Inner component that can use Redux hooks
const AppInner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.settings.darkMode);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [savedSettings, savedInvoices] = await Promise.all([
          StorageService.loadSettings(),
          StorageService.loadInvoices(),
        ]);
        if (savedSettings) {
          dispatch(loadSettings(savedSettings));
        } else {
          dispatch(setDarkMode(false));
        }
        if (savedInvoices.length > 0) {
          dispatch(loadInvoices(savedInvoices));
        }
      } catch (error) {
        console.warn('Storage load error:', error);
      }
    };

    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    setThemeMode(darkMode);
  }, [darkMode]);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        initialState={{
          routes: [{ name: 'Splash' }],
        }}
      >
        <StatusBar
          barStyle={darkMode ? 'light-content' : 'dark-content'}
          backgroundColor={darkMode ? '#1f1a17' : Colors.background}
          translucent={false}
        />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => (
  <Provider store={store}>
    <AppInner />
  </Provider>
);

export default App;
