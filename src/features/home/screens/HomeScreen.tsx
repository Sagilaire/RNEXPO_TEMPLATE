import { View, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, useTheme, useAnimatedColors } from '@/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, isDark, mode } = useTheme();
  const ac = useAnimatedColors();
  const insets = useSafeAreaInsets();

  const heroPaddingTop = insets.top + 48;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <StatusBar style="light" />
      <Animated.View style={[styles.container, ac.background]}>
        {/* Hero Section */}
        <View style={[styles.hero, { paddingTop: heroPaddingTop }]} accessibilityRole="header">
          {/* Decorative layers */}
          <View style={styles.heroBase}>
            <View
              style={[styles.decoCircle, styles.decoCircleLarge]}
              importantForAccessibility="no"
            />
            <View
              style={[styles.decoCircle, styles.decoCircleMedium]}
              importantForAccessibility="no"
            />
            <View
              style={[styles.decoCircle, styles.decoCircleSmall]}
              importantForAccessibility="no"
            />
            <View style={[styles.decoDot, styles.decoDot1]} importantForAccessibility="no" />
            <View style={[styles.decoDot, styles.decoDot2]} importantForAccessibility="no" />
            <View style={[styles.decoDot, styles.decoDot3]} importantForAccessibility="no" />
          </View>

          {/* Content */}
          <View style={styles.heroContent}>
            <Text style={[styles.heroLabel, { color: colors.heroTextSecondary }]}>
              EXPO TEMPLATE
            </Text>
            <Text style={[styles.heroTitle, { color: colors.heroText }]}>ExpoTemplate</Text>
            <Text style={[styles.heroSubtitle, { color: colors.heroTextSecondary }]}>
              A reusable Expo + React Native template.
            </Text>
          </View>
        </View>

        {/* Body Section */}
        <View style={styles.body}>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>Ready to build.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Expo SDK 56 · TypeScript · expo-router
          </Text>
          <Text style={[styles.modeIndicator, { color: colors.textTertiary }]}>
            {isDark ? '🌙' : '☀️'} {isDark ? 'Dark' : 'Light'} mode
            {mode === 'auto' ? ' · Auto' : ''}
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 32,
  },
  hero: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1A56DB',
  },
  heroContent: {
    gap: 8,
    zIndex: 1,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    fontFamily: 'Inter-Bold',
    opacity: 0.8,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  decoCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  decoCircleLarge: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: -SCREEN_WIDTH * 0.15,
    right: -SCREEN_WIDTH * 0.2,
  },
  decoCircleMedium: {
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_WIDTH * 0.45,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    bottom: -SCREEN_WIDTH * 0.12,
    left: -SCREEN_WIDTH * 0.1,
  },
  decoCircleSmall: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: SCREEN_WIDTH * 0.05,
    left: SCREEN_WIDTH * 0.12,
  },
  decoDot: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  decoDot1: {
    width: 8,
    height: 8,
    top: '22%',
    right: '18%',
  },
  decoDot2: {
    width: 5,
    height: 5,
    top: '38%',
    right: '28%',
  },
  decoDot3: {
    width: 6,
    height: 6,
    bottom: '30%',
    left: '22%',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
  modeIndicator: {
    fontSize: 12,
  },
});
