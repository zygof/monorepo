import { baseRadius, baseShadows, baseSpacing, baseTypography } from '../base';
import type { BrandTokens } from '../types';

export const marryshopTokens: BrandTokens = {
  id: 'marryshop',
  name: 'MARRYSHOP',
  displayName: 'Boutique Artisan',
  tagline: 'Fait à La Réunion, avec amour.',
  colors: {
    primary: '#A0522D',
    primaryLight: '#f8f0e8',
    primaryDark: '#7a3d20',
    secondary: '#5F7A61',
    secondaryLight: '#eef3ee',
    secondaryDark: '#3d5440',
    background: '#FAF7F2',
    surface: '#ffffff',
    text: '#2a1a0e',
    textMuted: '#6b7280',
    border: '#e0d5c8',
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  typography: {
    ...baseTypography,
    fontHeading: 'Lora, Georgia, serif',
  },
  spacing: baseSpacing,
  borderRadius: {
    ...baseRadius,
    md: '12px',
  },
  shadows: baseShadows,
} as const;
