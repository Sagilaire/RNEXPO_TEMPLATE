import { Text as NativeText, type TextProps as NativeTextProps } from 'react-native';
import { useTheme } from '@/core/theme';
import type { Colors } from '@/core/theme';

/**
 * Predefined typography variants.
 *
 * Each variant maps to a set of Tailwind classes for size, weight,
 * tracking, leading, and opacity — so you never need to write
 * `className="text-[34px] font-extrabold tracking-tight"` by hand.
 *
 * `className` is still accepted for one-off layout overrides
 * (e.g. `text-center`, `flex-1`, `mb-2`).
 */
const textVariants = {
  /** Hero title — 34px extrabold tracking-tight */
  hero: 'text-[34px] font-extrabold tracking-tight',
  /** Hero subtitle — 16px/22px */
  heroSub: 'text-base leading-[22px]',
  /** Hero label — 11px bold uppercase-style tracking */
  heroLabel: 'text-[11px] font-bold tracking-[2.5px] opacity-80',

  /** Page title — 28px extrabold */
  h1: 'text-[28px] font-extrabold',
  /** Section title — 24px bold (text-2xl) */
  h2: 'text-2xl font-bold',
  /** Subsection title — 18px semibold (text-lg) */
  h3: 'text-lg font-semibold',

  /** Default body — 16px (text-base) */
  body: 'text-base',
  /** Small body — 15px/22px */
  bodySmall: 'text-[15px] leading-[22px]',

  /** Label — 12px semibold with tracking (text-xs) */
  label: 'text-xs font-semibold tracking-[1.2px]',
  /** Caption — 12px (text-xs) */
  caption: 'text-xs',
  /** Description — 14px (text-sm) */
  description: 'text-sm',

  /** Button text — 15px semibold */
  button: 'text-[15px] font-semibold',
} as const;

export type TextVariant = keyof typeof textVariants;

export interface TextProps extends NativeTextProps {
  /** NativeWind/Tailwind class names for layout overrides */
  className?: string;
  /** Key from the theme Colors object to apply as text color */
  themeColor?: keyof Colors;
  /** Predefined typography variant (size, weight, tracking, etc.) */
  variant?: TextVariant;
}

/**
 * Unified Typography component.
 *
 * - **`variant`** — sets size, weight, tracking, leading (the "typography").
 * - **`themeColor`** — pulls a color from the active light/dark theme.
 * - **`className`** — for layout overrides only (text-center, flex-1, etc.).
 *
 * Examples:
 *   <Text variant="hero" themeColor="heroText">Title</Text>
 *   <Text variant="body" themeColor="textSecondary">Body</Text>
 *   <Text variant="button" className="text-white">Button</Text>
 */
export function Text({ variant, themeColor, className, style, ...props }: TextProps) {
  const { colors } = useTheme();
  const variantClasses = variant ? textVariants[variant] : '';

  return (
    <NativeText
      className={`font-['Inter'] ${variantClasses} ${className ?? ''}`.trim()}
      style={[themeColor ? { color: colors[themeColor] } : undefined, style]}
      {...props}
    />
  );
}
