import { View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, ThemedText, useTheme, useAnimatedColors } from '@/core';
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
      style={[{ flex: 1, backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.View className="flex-1 px-6 pt-6 gap-6" style={ac.background}>
        <ThemedText
          themeColor="text"
          className="text-[28px] font-extrabold font-['Inter-Bold']"
        >
          Settings
        </ThemedText>

        {/* Theme section */}
        <View className="gap-[10px]">
          <ThemedText
            themeColor="textSecondary"
            className="text-xs font-semibold tracking-[1.2px] mb-0.5"
          >
            APPEARANCE
          </ThemedText>

          {OPTIONS.map((opt) => {
            const isSelected = mode === opt.mode;
            return (
              <Pressable
                key={opt.mode}
                accessible
                accessibilityRole="radio"
                accessibilityLabel={`${opt.label} theme`}
                accessibilityState={{ selected: isSelected }}
                className="flex-row items-center p-4 rounded-[14px] border-[1.5px] gap-[14px] overflow-hidden"
                style={({ pressed }) => [
                  isSelected
                    ? { borderColor: colors.primary }
                    : { borderColor: colors.cardBorder },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => setMode(opt.mode)}
              >
                <Animated.View
                  className="absolute inset-0 rounded-[14px]"
                  style={ac.card}
                />
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={isSelected ? colors.primary : colors.textSecondary}
                />
                <Text
                  className="flex-1 text-base font-semibold z-[1]"
                  style={{
                    color: isSelected ? colors.primary : colors.text,
                    fontFamily: isSelected ? 'Inter-Bold' : 'Inter',
                  }}
                >
                  {opt.label}
                </Text>
                <View
                  className="w-[22px] h-[22px] rounded-full border-2 items-center justify-center z-[1]"
                  style={{
                    borderColor: isSelected ? colors.primary : colors.textTertiary,
                  }}
                >
                  {isSelected && (
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}

          <ThemedText themeColor="textTertiary" className="text-sm mt-1 pl-1">
            {mode === 'auto'
              ? 'Matches your device settings'
              : 'Overrides your device settings'}
          </ThemedText>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
