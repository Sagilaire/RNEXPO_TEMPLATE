import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, type Theme, type ThemeMode } from './colors';

const STORAGE_KEY = '@expo-template/theme-mode';

const ThemeContext = createContext<Theme>({
  colors: lightColors,
  isDark: false,
  colorScheme: null,
  mode: 'auto',
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [systemColorScheme, setSystemColorScheme] = useState(
    Appearance.getColorScheme() ?? 'dark',
  );

  // Load persisted theme preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        setModeState(stored);
      }
    });
  }, []);

  // Listen for system appearance changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme ?? 'dark');
    });
    return () => subscription.remove();
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  }, []);

  // Resolve effective color scheme
  const effectiveScheme = mode === 'auto' ? systemColorScheme : mode;
  const isDark = effectiveScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ colors, isDark, colorScheme: effectiveScheme, mode, setMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
