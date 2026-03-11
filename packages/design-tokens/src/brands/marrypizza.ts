import { baseRadius, baseShadows, baseSpacing, baseTypography } from '../base';
import type { BrandTokens } from '../types';

export const marrypizzaTokens: BrandTokens = {
  id: 'marrypizza',
  name: 'MARRYPIZZA',
  displayName: 'Pizzeria',
  tagline: 'La vraie pizza, livrée chez vous.',
  colors: {
    primary: '#E8401C',
    primaryLight: '#fdf1ee',
    primaryDark: '#b52e10',
    secondary: '#F5A623',
    secondaryLight: '#fef6e4',
    secondaryDark: '#c7841a',
    background: '#FDF6ED',
    surface: '#ffffff',
    text: '#1a1008',
    textMuted: '#6b7280',
    border: '#ead9c4',
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  typography: {
    ...baseTypography,
    fontHeading: 'Oswald, Impact, sans-serif',
  },
  spacing: baseSpacing,
  borderRadius: baseRadius,
  shadows: baseShadows,
} as const;
