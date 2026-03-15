/**
 * Client Stripe côté serveur — initialisation lazy.
 *
 * Ne lève pas d'erreur si STRIPE_SECRET_KEY n'est pas définie,
 * ce qui permet aux tiers Vitrine/Standard de fonctionner sans Stripe.
 */
import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Retourne le client Stripe ou null si non configuré.
 */
export function getStripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key);
  return _stripe;
}

/**
 * Retourne le client Stripe ou lève une erreur.
 * À utiliser uniquement dans les routes Premium.
 */
export function requireStripe(): Stripe {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error('Stripe non configuré. Vérifiez STRIPE_SECRET_KEY dans le .env');
  }
  return stripe;
}

/**
 * Vérifie la signature d'un webhook Stripe.
 * Lève une erreur si la signature est invalide.
 */
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
  const stripe = requireStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET non configuré');
  }
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
