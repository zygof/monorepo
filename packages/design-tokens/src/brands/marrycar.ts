import { baseRadius, baseShadows, baseSpacing, baseTypography } from '../base';
import type { BrandTokens } from '../types';

export const marrycarTokens: BrandTokens = {
  id: 'marrycar',
  name: 'MARRYCAR',
  displayName: 'Location de Voiture',
  tagline: "L'île à votre rythme.",
  colors: {
    primary: '#1B4FD8',
    primaryLight: '#eff3fd',
    primaryDark: '#1239a8',
    secondary: '#F97316',
    secondaryLight: '#fff4ed',
    secondaryDark: '#c85a0a',
    background: '#F8FAFF',
    surface: '#ffffff',
    text: '#0a1628',
    textMuted: '#6b7280',
    border: '#d1daf0',
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  typography: baseTypography,
  spacing: baseSpacing,
  borderRadius: {
    ...baseRadius,
    sm: '4px',
    md: '8px',
  },
  shadows: baseShadows,
} as const;
