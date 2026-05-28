import type { ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Colors {
  primary: string;
  background: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  heroText: string;
  heroTextSecondary: string;
  circleDecoration: string;
}

export interface Theme {
  colors: Colors;
  isDark: boolean;
  colorScheme: ColorSchemeName | null;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const lightColors: Colors = {
  primary: '#208AEF',
  background: '#F5F7FA',
  card: '#FFFFFF',
  cardBorder: 'rgba(0, 0, 0, 0.04)',
  text: '#1A1A2E',
  textSecondary: '#8E8E93',
  textTertiary: '#A0A0A8',
  heroText: '#FFFFFF',
  heroTextSecondary: 'rgba(255, 255, 255, 0.85)',
  circleDecoration: '#FFFFFF',
};

export const darkColors: Colors = {
  primary: '#1F6FEB',
  background: '#0D1117',
  card: '#161B22',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textTertiary: '#6E7681',
  heroText: '#FFFFFF',
  heroTextSecondary: 'rgba(255, 255, 255, 0.85)',
  circleDecoration: '#FFFFFF',
};
