import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { allBrands } from '../src/tokens';
import type { BrandId, TokensJson } from '../src/types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

mkdirSync(distDir, { recursive: true });

// Parse "0 4px 6px -1px rgb(...)" → { x, y, blur, spread }
function parseShadow(shadowStr: string): { x: string; y: string; blur: string; spread: string } {
  const first = shadowStr.split(',')[0].trim();
  const parts = first.split(' ');
  return {
    x: parts[0] === '0' ? '0px' : parts[0],
    y: parts[1] ?? '4px',
    blur: parts[2] ?? '8px',
    spread: parts[3] ?? '0px',
  };
}

const templateBrands: BrandId[] = ['marryhair', 'marrypizza', 'marryfood', 'marrycar', 'marryshop'];

for (const brandId of templateBrands) {
  const brand = allBrands[brandId];

  // tokens.[brand].json — format complet (usage interne)
  const json: TokensJson = {
    brand: brand.name,
    version: '1.0.0',
    colors: brand.colors,
    typography: brand.typography,
    spacing: brand.spacing,
    borderRadius: brand.borderRadius,
    shadows: brand.shadows,
  };
  writeFileSync(join(distDir, `tokens.${brandId}.json`), JSON.stringify(json, null, 2) + '\n');
  console.log(`✓ Generated tokens.${brandId}.json`);

  // Extraire fonts (premier nom sans fallbacks)
  const sans = brand.typography.fontBody.split(',')[0].trim();
  const serif = brand.typography.fontHeading.split(',')[0].trim();
  const mono = brand.typography.fontMono.split(',')[0].trim();

  // Décomposer shadow md en x/y/blur/spread
  const shadow = parseShadow(brand.shadows.md);

  // theme.[brand].json — format plat UX Pilot
  const uxpilotTheme: Record<string, string> = {
    // Primary Colors
    '--primary': brand.colors.primary,
    '--primary-foreground': '#ffffff',
    // Secondary Colors
    '--secondary': brand.colors.secondary,
    '--secondary-foreground': '#ffffff',
    // Accent Colors
    '--accent': brand.colors.secondaryLight,
    '--accent-foreground': brand.colors.text,
    // Neutral Colors
    '--background': brand.colors.background,
    '--foreground': brand.colors.text,
    // Card & Popover Colors
    '--card': brand.colors.surface,
    '--card-foreground': brand.colors.text,
    '--popover': brand.colors.surface,
    '--popover-foreground': brand.colors.text,
    // Border & Input Colors
    '--border': brand.colors.border,
    '--input': brand.colors.surface,
    '--ring': brand.colors.primary,
    // Destructive Colors
    '--destructive': brand.colors.error,
    '--destructive-foreground': '#ffffff',
    // Muted Colors
    '--muted': brand.colors.primaryLight,
    '--muted-foreground': brand.colors.textMuted,
    // Fonts — clés sans/serif/mono (UX Pilot)
    '--sans': sans,
    '--serif': serif,
    '--mono': mono,
    // Border radius — valeur unique (base) + échelle
    '--radius': brand.borderRadius.md,
    '--radius-sm': brand.borderRadius.sm,
    '--radius-md': brand.borderRadius.md,
    '--radius-lg': brand.borderRadius.lg,
    '--radius-xl': brand.borderRadius.xl,
    '--radius-full': brand.borderRadius.full,
    // Shadows — clés exactes UX Pilot
    '--x-position': shadow.x,
    '--y-position': shadow.y,
    '--blur': shadow.blur,
    '--spread': shadow.spread,
    '--shadow-color': brand.colors.text,
    '--shadow-opacity': '0.1',
  };
  writeFileSync(
    join(distDir, `theme.${brandId}.json`),
    JSON.stringify(uxpilotTheme, null, 2) + '\n',
  );
  console.log(`✓ Generated theme.${brandId}.json (UX Pilot format)`);
}

console.log('\n✅ All tokens generated successfully.');
