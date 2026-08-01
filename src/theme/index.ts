const lightPalette = {
  primary: '#B17148',
  primaryLight: '#D19A70',
  primaryDark: '#9C633F',
  secondary: '#F4E7DE',
  secondaryLight: '#F7EFE8',
  background: '#F8F5F2',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8DED6',
  borderLight: '#F3EAE3',

  success: '#2E8B57',
  successLight: '#EAF7F0',
  error: '#D7654A',
  errorLight: '#FDEBE7',
  warning: '#E9A35A',
  warningLight: '#FFF2E1',
  info: '#6F8EA6',

  text: '#222222',
  textSecondary: '#8A817A',
  textMuted: '#A89A91',
  textInverse: '#FFFFFF',

  overlay: 'rgba(42, 27, 20, 0.38)',
  shadow: 'rgba(177, 113, 72, 0.12)',
  shadowDark: 'rgba(45, 32, 25, 0.12)',

  categoryBg: ['#F7E9E0', '#F3E5DA', '#F8F1EA', '#F4EEE9', '#F5F0EE', '#FBF5F0', '#F2E4DC', '#EEE8E3'],
};

const darkPalette = {
  primary: '#C9865E',
  primaryLight: '#E2A57D',
  primaryDark: '#9C633F',
  secondary: '#2F241E',
  secondaryLight: '#43342D',
  background: '#171312',
  surface: '#201B19',
  card: '#27211F',
  border: '#3B2E29',
  borderLight: '#483C36',

  success: '#59B67E',
  successLight: '#163B2D',
  error: '#E6856D',
  errorLight: '#3D2521',
  warning: '#E5AE66',
  warningLight: '#3A2A1D',
  info: '#7EA7C5',

  text: '#F3EDE8',
  textSecondary: '#CDB8AA',
  textMuted: '#A19086',
  textInverse: '#FFFFFF',

  overlay: 'rgba(2, 1, 1, 0.62)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.42)',

  categoryBg: ['#3B2B23', '#423229', '#362D2A', '#2D2A2C', '#322B2B', '#3D312A', '#2D2A2C', '#2B2728'],
};

export let Colors = lightPalette;

export const setThemeMode = (darkMode: boolean) => {
  Colors = darkMode ? darkPalette : lightPalette;
};

export const Typography = {
  fontSizeXS: 10,
  fontSizeSM: 12,
  fontSizeMD: 14,
  fontSizeLG: 16,
  fontSizeXL: 18,
  fontSize2XL: 22,
  fontSize3XL: 26,
  fontSize4XL: 32,

  fontFamily: 'Inter',
  fontWeightLight: '300' as const,
  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
  fontWeightExtraBold: '800' as const,

  lineHeightSM: 18,
  lineHeightMD: 22,
  lineHeightLG: 26,
  lineHeightXL: 32,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 24,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#2A1B14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#2A1B14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#B17148',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
};
