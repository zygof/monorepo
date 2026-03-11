export { baseRadius, baseShadows, baseSpacing, baseTypography } from './base';
export { marrycarTokens } from './brands/marrycar';
export { marryfoodTokens } from './brands/marryfood';
export { marryhairTokens } from './brands/marryhair';
export { marrynovTokens } from './brands/marrynov';
export { marrypizzaTokens } from './brands/marrypizza';
export { marryshopTokens } from './brands/marryshop';
export type {
  BrandId,
  BrandTokens,
  ColorTokens,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  TokensJson,
  TypographyTokens,
} from './types';

import { marrycarTokens } from './brands/marrycar';
import { marryfoodTokens } from './brands/marryfood';
import { marryhairTokens } from './brands/marryhair';
import { marrynovTokens } from './brands/marrynov';
import { marrypizzaTokens } from './brands/marrypizza';
import { marryshopTokens } from './brands/marryshop';
import type { BrandId, BrandTokens } from './types';

export const allBrands: Record<BrandId, BrandTokens> = {
  marrynov: marrynovTokens,
  marryhair: marryhairTokens,
  marrypizza: marrypizzaTokens,
  marryfood: marryfoodTokens,
  marrycar: marrycarTokens,
  marryshop: marryshopTokens,
};

export function getBrandTokens(id: BrandId): BrandTokens {
  return allBrands[id];
}
