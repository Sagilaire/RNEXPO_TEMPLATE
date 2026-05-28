import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, useTheme, useAnimatedColors } from '@/core';
import { heroStyles } from './HomeScreen.styles';

export default function HomeScreen() {
  const { colors, isDark, mode } = useTheme();
  const ac = useAnimatedColors();
  const insets = useSafeAreaInsets();

  const heroPaddingTop = insets.top + 48;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <StatusBar style="light" />
      <Animated.View className="flex-1 px-6 gap-8" style={ac.background}>
        {/* Hero Section */}
        <View
          className="-mx-6 px-6 pb-10 rounded-b-[28px] overflow-hidden relative"
          style={{ paddingTop: heroPaddingTop }}
          accessibilityRole="header"
        >
          {/* Decorative layers */}
          <View className="absolute inset-0 bg-[#1A56DB]">
            <View className="absolute rounded-full" style={heroStyles.decoCircleLarge} />
            <View className="absolute rounded-full" style={heroStyles.decoCircleMedium} />
            <View className="absolute rounded-full" style={heroStyles.decoCircleSmall} />
            <View className="absolute rounded-full bg-white/12" style={heroStyles.decoDot1} />
            <View className="absolute rounded-full bg-white/12" style={heroStyles.decoDot2} />
            <View className="absolute rounded-full bg-white/12" style={heroStyles.decoDot3} />
          </View>

          {/* Content */}
          <View className="gap-2 z-[1]">
            <Text variant="heroLabel" themeColor="heroTextSecondary">
              EXPO TEMPLATE
            </Text>
            <Text variant="hero" themeColor="heroText">
              ExpoTemplate
            </Text>
            <Text variant="heroSub" themeColor="heroTextSecondary">
              A reusable Expo + React Native template.
            </Text>
          </View>
        </View>

        {/* Body Section */}
        <View className="flex-1 items-center justify-center">
          <Text variant="h3" themeColor="textSecondary">
            Ready to build.
          </Text>
        </View>

        {/* Footer */}
        <View className="items-center pb-4 gap-1">
          <Text variant="caption" themeColor="textTertiary">
            Expo SDK 56 · TypeScript · expo-router
          </Text>
          <Text variant="caption" themeColor="textTertiary">
            {isDark ? '🌙' : '☀️'} {isDark ? 'Dark' : 'Light'} mode
            {mode === 'auto' ? ' · Auto' : ''}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
