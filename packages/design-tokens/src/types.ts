export type BrandId =
  | 'marrynov'
  | 'marryhair'
  | 'marrypizza'
  | 'marryfood'
  | 'marrycar'
  | 'marryshop';

export interface ColorTokens {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface TypographyTokens {
  fontHeading: string;
  fontBody: string;
  fontMono: string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface BrandTokens {
  id: BrandId;
  name: string;
  displayName: string;
  tagline: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: RadiusTokens;
  shadows: ShadowTokens;
}

export interface TokensJson {
  brand: string;
  version: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: RadiusTokens;
  shadows: ShadowTokens;
}
