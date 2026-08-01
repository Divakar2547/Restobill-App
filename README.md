# Restobill

Restobill is a modern restaurant billing and order management app built with React Native and Expo.

## Features

- Home dashboard with sales and order insights
- Menu browsing with category filtering and search
- Cart management and quantity controls
- Billing and payment flow
- Invoice and receipt generation
- Theme support with light and dark modes
- Local storage persistence for app settings and invoice data

## Tech Stack

- React Native
- Expo
- TypeScript
- Redux Toolkit
- AsyncStorage
- React Navigation

## Getting Started

1. Install dependencies:
   npm install

2. Start the Expo app:
   npm start

3. Run on Android/iOS simulator or real device:
   - Android: npm run android
   - iOS: npm run ios

## Project Structure

- src/screens - app screens
- src/components - reusable UI components
- src/store - Redux state and slices
- src/theme - theme colors and styling config
- src/data - menu and application data
- src/services - local storage helpers

## Notes

- The app uses a coffee-inspired premium design.
- Settings and theme preferences are persisted locally.
- Menu data can be updated manually in src/data/menuData.ts.

## Verification

This project has been checked with TypeScript validation:

npx tsc --noEmit
