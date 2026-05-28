import { type TextProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/core/theme';
import type { Colors } from '@/core/theme';

interface ThemedTextProps extends TextProps {
  /** Key from the theme Colors object to apply as text color */
  themeColor?: keyof Colors;
  className?: string;
}

/**
 * A Text component that automatically applies a color from the theme.
 *
 * Usage:
 *   <ThemedText themeColor="textSecondary">Hello</ThemedText>
 *
 * Instead of:
 *   <Text style={{ color: colors.textSecondary }}>Hello</Text>
 */
export function ThemedText({ themeColor, style, ...props }: ThemedTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[themeColor ? { color: colors[themeColor] } : undefined, style]}
      {...props}
    />
  );
}
