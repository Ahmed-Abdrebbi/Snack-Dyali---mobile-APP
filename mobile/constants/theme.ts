/**
 * Stitch Design System Theme for SNACK--DYALI
 * Generated based on project ID 1565966944807253308
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // We strictly use the dark mode palette per Stitch design rules, but we define light mode as fallback
    text: '#e3e2e2',
    background: '#121414',
    surface: '#1e2020',
    surfaceRaised: '#2c2c2c',
    primary: '#ff7a00',
    secondary: '#e53935',
    success: '#4CAF50',
    tint: '#ff7a00',
    icon: '#e3e2e2',
    tabIconDefault: '#a0a0a0',
    tabIconSelected: '#ff7a00',
    border: '#2c2c2c',
  },
  dark: {
    text: '#e3e2e2',
    textDim: '#a0a0a0',
    background: '#121414', // Deep Charcoal
    surface: '#1e2020', // Dark Surface Level 1
    surfaceRaised: '#2c2c2c', // Surface Level 2 / 3
    primary: '#ff7a00', // Spicy Saffron Orange
    secondary: '#e53935', // Harissa Red
    success: '#4CAF50', // Mint Green
    tint: '#ff7a00',
    icon: '#e3e2e2',
    tabIconDefault: '#a0a0a0',
    tabIconSelected: '#ff7a00',
    border: '#2c2c2c',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Typography = {
  headlineLg: {
    fontFamily: Fonts.sans,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.64, // -0.02em of 32
  },
  headlineLgMobile: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  headlineMd: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  headlineSm: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.6, // 0.05em of 12
  },
  labelSm: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  marginMobile: 16,
  marginDesktop: 32,
};

export const Rounded = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
