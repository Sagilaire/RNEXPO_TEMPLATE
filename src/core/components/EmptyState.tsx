import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { useTheme } from '@/core/theme';
import { cn } from '@/core/utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'folder-open-outline',
  title,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className={cn('flex-1 items-center justify-center px-8 gap-4', className)}>
      <Ionicons
        name={icon}
        size={64}
        color={colors.textTertiary}
        accessibilityRole="image"
        accessibilityLabel={title}
      />
      <Text variant="h3" themeColor="textSecondary" className="text-center">
        {title}
      </Text>
      {message && (
        <Text variant="bodySmall" themeColor="textTertiary" className="text-center">
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
