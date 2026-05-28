import { Pressable, ActivityIndicator, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/core/theme';
import type { StyleProp } from 'react-native';

const variantStyles = {
  primary: 'bg-primary-500',
  secondary: 'bg-gray-100',
  outline: 'border border-primary-500',
  ghost: 'bg-transparent',
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
} as const;

const textVariants = {
  sm: 'button',
  md: 'button',
  lg: 'button',
} as const;

const textColorVariants: Record<string, string> = {
  primary: 'text-white',
  secondary: 'text-gray-900',
  outline: 'text-primary',
  ghost: 'text-primary',
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
  style,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      className={`rounded-xl items-center justify-center flex-row gap-2
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled || loading ? 'opacity-50' : ''}
        ${className ?? ''}`.trim()}
      style={({ pressed }) => [
        style,
        pressed && !disabled && !loading && { opacity: 0.8 },
      ]}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : colors.primary} />}
      {typeof children === 'string' ? (
        <Text variant="button" className={textColorVariants[variant]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
