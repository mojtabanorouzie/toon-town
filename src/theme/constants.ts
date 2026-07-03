import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  title: 40,
  hero: 48,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Minimum tap target size for toddlers (80x80pt)
export const touchTarget = {
  min: 80,
  recommended: 100,
};

export const screen = {
  width,
  height,
  isSmall: width < 375,
};

export const layout = {
  padding: spacing.lg,
  gap: spacing.md,
  cardSize: Math.min(width * 0.4, 160),
  buttonHeight: touchTarget.recommended,
};
