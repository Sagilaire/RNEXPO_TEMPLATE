import { Text as NativeText, type TextProps } from 'react-native';

interface ThemedTextProps extends TextProps {
  /** NativeWind/Tailwind class names */
  className?: string;
}

export function Text({ className, ...props }: ThemedTextProps) {
  return <NativeText className={`font-['Inter'] ${className ?? ''}`} {...props} />;
}
