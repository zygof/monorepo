import { baseRadius, baseShadows, baseSpacing, baseTypography } from '../base';
import type { BrandTokens } from '../types';

// Couleurs extraites depuis apps/marrynov/src/app/globals.css
export const marrynovTokens: BrandTokens = {
  id: 'marrynov',
  name: 'MARRYNOV',
  displayName: 'MARRYNOV',
  tagline: 'Ici pour vous développer.',
  colors: {
    primary: '#6b40a0',
    primaryLight: '#f8f6fc',
    primaryDark: '#7f13ec',
    secondary: '#e67e22',
    secondaryLight: '#fdf1e8',
    secondaryDark: '#f27f0d',
    background: '#f7f6f8',
    surface: '#ffffff',
    text: '#2c3e50',
    textMuted: '#64748b',
    border: '#e2e8f0',
    success: '#22c55e',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: baseRadius,
  shadows: baseShadows,
} as const;
