import { View } from 'react-native';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { ErrorBoundary, ThemeProvider, AnimatedThemeProvider, useTheme } from '@/core';

// eslint-disable-next-line import/no-unassigned-import
import '../../global.css';

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { colorScheme } = useTheme();

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <AnimatedThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AnimatedThemeProvider>
    </View>
  );
}

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
        <RootLayoutContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
