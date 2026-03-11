import { baseRadius, baseShadows, baseSpacing, baseTypography } from '../base';
import type { BrandTokens } from '../types';

export const marryfoodTokens: BrandTokens = {
  id: 'marryfood',
  name: 'MARRYFOOD',
  displayName: 'Restaurant Créole',
  tagline: "Les saveurs de l'île, à votre table.",
  colors: {
    primary: '#D4821A',
    primaryLight: '#fef3e2',
    primaryDark: '#a8640d',
    secondary: '#2D6A4F',
    secondaryLight: '#edf6f1',
    secondaryDark: '#1a4532',
    background: '#FEFAE0',
    surface: '#ffffff',
    text: '#1a1200',
    textMuted: '#6b7280',
    border: '#e6d9b8',
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
  borderRadius: baseRadius,
  shadows: baseShadows,
} as const;
