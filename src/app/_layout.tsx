import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { ErrorBoundary, ThemeProvider, AnimatedThemeProvider } from '@/core';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter: require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar style="auto" />
      <ThemeProvider>
        <AnimatedThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AnimatedThemeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
