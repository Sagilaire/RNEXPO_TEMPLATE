import { View, Pressable, type ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@/core/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function Card({ children, className, style, onPress, accessibilityLabel }: CardProps) {
  const baseClasses = 'bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-card-border-light dark:border-card-border-dark';

  const content = (
    <View
      className={cn(baseClasses, className)}
      style={style}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
