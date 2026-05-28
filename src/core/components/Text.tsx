import { Text as NativeText, type TextProps, StyleSheet } from 'react-native';

interface ThemedTextProps extends TextProps {
  /** NativeWind/Tailwind class names — forward-compatible, no-op until NativeWind is installed */
  className?: string;
}

export function Text({ style, className: _className, ...props }: ThemedTextProps) {
  return <NativeText style={[styles.base, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Inter',
  },
});
