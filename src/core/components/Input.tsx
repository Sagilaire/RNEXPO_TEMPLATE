import { TextInput, View, type TextInputProps as RNTextInputProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/core/theme';
import { cn } from '@/core/utils/cn';

interface InputProps extends Omit<RNTextInputProps, 'className' | 'style'> {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
}

export function Input({
  label,
  error,
  className,
  inputClassName,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View className={cn('gap-1', className)}>
      {label && (
        <Text variant="label" themeColor="textSecondary" className="mb-0.5">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'rounded-xl px-4 py-3 text-base font-[\'Inter\']',
          error ? 'border border-error' : 'border border-gray-300 dark:border-gray-600',
          inputClassName,
        )}
        placeholderTextColor={colors.textTertiary}
        style={{ color: colors.text }}
        {...textInputProps}
      />
      {error && (
        <Text variant="caption" themeColor="error" className="mt-0.5">
          {error}
        </Text>
      )}
    </View>
  );
}
