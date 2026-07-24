/**
 * Stitch Design System Theme for SNACK--DYALI
 * Premium Artisanal Dark Mode
 * Generated based on project ID 1565966944807253308
 */

import { Platform } from 'react-native';

const darkTheme = {
  // Backgrounds
  background: '#000000',        // True Black — primary background
  backgroundElevated: '#121212', // Deep Charcoal — secondary/elevated background
  
  // Surfaces
  surface: '#1A1A1A',           // Card/surface fill
  surfaceBorder: '#2A2A2A',     // Subtle border on surfaces
  
  // Text
  text: '#FFFFFF',              // Primary text — pure white
  textSecondary: '#E0E0E0',     // Secondary text — light grey
  textMuted: '#888888',         // Muted/dim text
  textDisabled: '#555555',      // Disabled text
  
  // Accents
  primary: '#D4AF37',           // Saffron Gold — primary actions, available state
  primaryText: '#000000',       // Text on primary background
  secondary: '#E53935',         // Harissa Red — destructive actions, unavailable state
  secondaryText: '#FFFFFF',     // Text on secondary background
  
  // Semantic
  success: '#4CAF50',           // Success/available indicator
  
  // Aliases
  tint: '#D4AF37',
  icon: '#FFFFFF',
  iconMuted: '#888888',
  tabIconDefault: '#888888',
  tabIconSelected: '#D4AF37',
  
  // Toggle
  toggleActive: '#D4AF37',
  toggleInactive: '#333333',
  toggleThumb: '#FFFFFF',
};

export const Colors = {
  dark: darkTheme,
  light: darkTheme,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
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
    rounded: "Inter, system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Typography = {
  headlineLg: {
    fontFamily: Fonts?.sans,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.64,
  },
  headlineMd: {
    fontFamily: Fonts?.sans,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  headlineSm: {
    fontFamily: Fonts?.sans,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLgBold: {
    fontFamily: Fonts?.sans,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySm: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  labelLg: {
    fontFamily: Fonts?.sans,
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.28,
  },
  labelMd: {
    fontFamily: Fonts?.sans,
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  labelSm: {
    fontFamily: Fonts?.sans,
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
  xxl: 48,
  gutter: 16,
  screenPadding: 20,
};

export const Rounded = {
  sm: 4,
  DEFAULT: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
