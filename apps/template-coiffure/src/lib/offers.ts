/**
 * Système de tiers MARRYNOV — détermine les fonctionnalités actives.
 *
 * Variable d'env : NEXT_PUBLIC_OFFER_TIER = 'standard' | 'expert' | 'premium'
 *
 * Standard : site vitrine (présence digitale, prise de contact)
 * Expert   : Standard + réservation RDV, admin, staff, fidélisation, auth
 * Premium  : Expert + paiement en ligne (acompte Stripe à la réservation)
 *
 * Pour upgrader un client : changer NEXT_PUBLIC_OFFER_TIER dans le .env → redeploy.
 */

export type OfferTier = 'standard' | 'expert' | 'premium';

const VALID_TIERS: OfferTier[] = ['standard', 'expert', 'premium'];

/**
 * Tier courant lu depuis l'env. Fallback : 'expert' (comportement actuel).
 */
export function getOfferTier(): OfferTier {
  const raw = process.env.NEXT_PUBLIC_OFFER_TIER as string | undefined;
  if (raw && VALID_TIERS.includes(raw as OfferTier)) {
    return raw as OfferTier;
  }
  return 'expert';
}

// ── Feature flags dérivés du tier ───────────────────────────────────

/** Réservation en ligne (booking wizard, calendrier, créneaux) */
export function hasBooking(): boolean {
  return getOfferTier() !== 'standard';
}

/** Système d'authentification (comptes clients, login/signup) */
export function hasAuth(): boolean {
  return getOfferTier() !== 'standard';
}

/** Espace admin (gestion services, RDV, équipe, galerie, etc.) */
export function hasAdmin(): boolean {
  return getOfferTier() !== 'standard';
}

/** Espace staff / styliste */
export function hasStaff(): boolean {
  return getOfferTier() !== 'standard';
}

/** Programme de fidélité */
export function hasLoyalty(): boolean {
  return getOfferTier() !== 'standard';
}

/** Paiement en ligne (acompte Stripe à la réservation) */
export function hasPayment(): boolean {
  return getOfferTier() === 'premium';
}

// ── Config acompte (Premium) ────────────────────────────────────────

/**
 * Pourcentage d'acompte — configurable via NEXT_PUBLIC_DEPOSIT_PERCENTAGE.
 * Fallback : 30% (standard marché coiffure pour réduire les no-shows).
 */
export function getDepositPercentage(): number {
  const raw = process.env.NEXT_PUBLIC_DEPOSIT_PERCENTAGE;
  if (raw) {
    const parsed = Number(raw);
    if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 100) return parsed;
  }
  return 30;
}

/**
 * Montant minimum d'acompte — configurable via NEXT_PUBLIC_DEPOSIT_MIN_EUROS.
 * Fallback : 5€ (500 centimes).
 */
export function getDepositMinCents(): number {
  const raw = process.env.NEXT_PUBLIC_DEPOSIT_MIN_EUROS;
  if (raw) {
    const parsed = Number(raw);
    if (!Number.isNaN(parsed) && parsed > 0) return Math.round(parsed * 100);
  }
  return 500;
}

/**
 * Calcule le montant de l'acompte en centimes.
 * @param totalCents Montant total de la réservation en centimes
 */
export function calculateDeposit(totalCents: number): number {
  const percentage = getDepositPercentage();
  const minCents = getDepositMinCents();
  const deposit = Math.round(totalCents * (percentage / 100));
  return Math.max(deposit, minCents);
}

/**
 * Formate un montant en centimes → "12,50 €"
 */
export function formatCentsToEuros(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

// ── Navigation helpers ──────────────────────────────────────────────

/** CTA principal du hero — contact pour Standard, réservation pour Expert+ */
export function getPrimaryCta(): { label: string; href: string } {
  if (!hasBooking()) {
    return { label: 'Nous Contacter', href: '/contact' };
  }
  return { label: 'Prendre Rendez-vous', href: '/reserver' };
}

/** Liens de navigation filtrés selon le tier */
export function getNavLinks(
  baseLinks: Array<{ label: string; href: string }>,
): Array<{ label: string; href: string }> {
  return baseLinks;
}

/** Liens du footer filtrés selon le tier */
export function getFooterQuickLinks(
  links: Array<{ label: string; href: string }>,
): Array<{ label: string; href: string }> {
  if (!hasBooking()) {
    return links.filter((l) => l.href !== '/reserver' && l.href !== '/compte');
  }
  return links;
}
