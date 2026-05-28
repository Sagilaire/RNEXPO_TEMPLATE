import { clsx, type ClassValue } from 'clsx';

/**
 * Merge Tailwind/NativeWind class names with conflict resolution.
 * Wraps `clsx` for consistency — add Tailwind-specific logic here later.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
