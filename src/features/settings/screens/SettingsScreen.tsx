import { View, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, useTheme, useAnimatedColors } from '@/core';
import type { ThemeMode } from '@/core';

const OPTIONS: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { mode: 'light', icon: 'sunny-outline', label: 'Light' },
  { mode: 'dark', icon: 'moon-outline', label: 'Dark' },
  { mode: 'auto', icon: 'phone-portrait-outline', label: 'System (Auto)' },
];

export default function SettingsScreen() {
  const { colors, mode, setMode, isDark } = useTheme();
  const ac = useAnimatedColors();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.View style={[styles.container, ac.background]}>
        <Text style={[styles.heading, { color: colors.text }]}>Settings</Text>

        {/* Theme section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            APPEARANCE
          </Text>

          {OPTIONS.map((opt) => {
            const isSelected = mode === opt.mode;
            return (
              <Pressable
                key={opt.mode}
                accessible
                accessibilityRole="radio"
                accessibilityLabel={`${opt.label} theme`}
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.option,
                  isSelected
                    ? { borderColor: colors.primary }
                    : { borderColor: colors.cardBorder },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => setMode(opt.mode)}
              >
                <Animated.View
                  style={[StyleSheet.absoluteFill, styles.optionBgInner, ac.card]}
                />
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    {
                      color: isSelected ? colors.primary : colors.text,
                      fontFamily: isSelected ? 'Inter-Bold' : 'Inter',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: isSelected ? colors.primary : colors.textTertiary },
                  ]}
                >
                  {isSelected && (
                    <View
                      style={[styles.radioInner, { backgroundColor: colors.primary }]}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}

          <Text style={[styles.hint, { color: colors.textTertiary }]}>
            {mode === 'auto'
              ? 'Matches your device settings'
              : 'Overrides your device settings'}
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
    paddingTop: 24,
    gap: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 14,
    overflow: 'hidden',
  },
  optionBgInner: {
    borderRadius: 14,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    zIndex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  hint: {
    fontSize: 13,
    marginTop: 4,
    paddingLeft: 4,
  },
});
