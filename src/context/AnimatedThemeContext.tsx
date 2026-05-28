import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";
import type { AnimatedStyle } from "react-native-reanimated";
import { lightColors, darkColors, type Colors } from "@/theme/colors";
import { useTheme } from "./ThemeContext";

/** Progress: 0 = light, 1 = dark */
const AnimatedThemeContext = createContext<{ progress: { value: number } }>({
  progress: { value: 0 },
});

const TIMING_CONFIG = { duration: 350 };

export function AnimatedThemeProvider({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  const progress = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isDark ? 1 : 0, TIMING_CONFIG);
  }, [isDark, progress]);

  return (
    <AnimatedThemeContext.Provider value={{ progress }}>
      {children}
    </AnimatedThemeContext.Provider>
  );
}

/**
 * Returns an object with an animated style for every color in the theme.
 *
 * Usage:
 *   const ac = useAnimatedColors();
 *   <Animated.View style={[styles.card, ac.background]} />
 */
export function useAnimatedColors(): Record<keyof Colors, AnimatedStyle<any>> {
  const { progress } = useContext(AnimatedThemeContext);

  const primary = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.primary, darkColors.primary],
    ),
  }));

  const background = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.background, darkColors.background],
    ),
  }));

  const card = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.card, darkColors.card],
    ),
  }));

  const cardBorder = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.cardBorder, darkColors.cardBorder],
    ),
  }));

  const text = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.text, darkColors.text],
    ),
  }));

  const textSecondary = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.textSecondary, darkColors.textSecondary],
    ),
  }));

  const textTertiary = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.textTertiary, darkColors.textTertiary],
    ),
  }));

  const heroText = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.heroText, darkColors.heroText],
    ),
  }));

  const heroTextSecondary = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.heroTextSecondary, darkColors.heroTextSecondary],
    ),
  }));

  const circleDecoration = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [lightColors.circleDecoration, darkColors.circleDecoration],
    ),
  }));

  return {
    primary,
    background,
    card,
    cardBorder,
    text,
    textSecondary,
    textTertiary,
    heroText,
    heroTextSecondary,
    circleDecoration,
  };
}
