import { baseRadius, baseShadows, baseSpacing, baseTypography } from '../base';
import type { BrandTokens } from '../types';

export const marryhairTokens: BrandTokens = {
  id: 'marryhair',
  name: 'MARRYHAIR',
  displayName: 'Salon de Coiffure',
  tagline: 'Révélez votre beauté.',
  colors: {
    primary: '#8B2D5C',
    primaryLight: '#f7eef3',
    primaryDark: '#5c1d3e',
    secondary: '#C9A84C',
    secondaryLight: '#f9f4e3',
    secondaryDark: '#a0862e',
    background: '#FDFAF7',
    surface: '#ffffff',
    text: '#2d2020',
    textMuted: '#6b7280',
    border: '#e8ddd8',
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',
    info: '#2563eb',
  },
  typography: {
    ...baseTypography,
    fontHeading: 'Playfair Display, Georgia, serif',
  },
  spacing: baseSpacing,
  borderRadius: {
    ...baseRadius,
    md: '12px',
    lg: '20px',
  },
  shadows: baseShadows,
} as const;
