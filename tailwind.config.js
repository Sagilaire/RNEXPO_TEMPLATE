/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#208AEF',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#161B22',
        },
        background: {
          light: '#F5F7FA',
          dark: '#0D1117',
        },
        card: {
          light: '#FFFFFF',
          dark: '#161B22',
        },
        'card-border': {
          light: 'rgba(0, 0, 0, 0.04)',
          dark: 'rgba(255, 255, 255, 0.06)',
        },
        text: {
          DEFAULT: '#1A1A2E',
          dark: '#E6EDF3',
          secondary: '#8E8E93',
          'secondary-dark': '#8B949E',
          tertiary: '#A0A0A8',
          'tertiary-dark': '#6E7681',
        },
        hero: {
          text: '#FFFFFF',
          'text-secondary': 'rgba(255, 255, 255, 0.85)',
        },
        'deco-circle': '#FFFFFF',
        error: {
          DEFAULT: '#EF4444',
          dark: '#F87171',
        },
        success: {
          DEFAULT: '#22C55E',
          dark: '#4ADE80',
        },
        warning: {
          DEFAULT: '#F59E0B',
          dark: '#FBBF24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        bold: ['Inter-Bold', 'System'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
