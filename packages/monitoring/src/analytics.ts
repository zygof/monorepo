'use client';

// ---------------------------------------------------------------------------
// Types des events GA4 — stricts, RGPD-safe (pas de données personnelles)
// ---------------------------------------------------------------------------

export interface CartItem {
  item_id: string;
  item_name: string;
  item_category: string;
  quantity: number;
  price: number;
}

export interface PurchasedItem extends CartItem {
  item_variant?: string;
}

/** Map complète de tous les events custom MARRYNOV */
export interface AnalyticsEventMap {
  // --- Universels (tous templates) ---
  cta_click: { location: string; label: string };
  form_submit: { form_id: string; form_name: string };

  // --- E-commerce / Pizzeria ---
  view_item: {
    item_id: string;
    item_name: string;
    item_category: string;
    price: number;
    currency?: string;
  };
  add_to_cart: {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
    currency?: string;
  };
  remove_from_cart: {
    item_id: string;
    item_name: string;
    quantity: number;
  };
  begin_checkout: {
    value: number;
    currency: string;
    items: CartItem[];
  };
  purchase: {
    transaction_id: string;
    value: number;
    currency: string;
    items: PurchasedItem[];
  };

  // --- Réservation (coiffure / restaurant) ---
  view_service: {
    service_id: string;
    service_name: string;
    price: number;
  };
  begin_reservation: {
    service_id: string;
    date: string; // ISO 8601
  };
  reservation_confirmed: {
    reservation_id: string;
    service_id: string;
    value: number; // montant acompte
    date: string;
    currency?: string;
  };
  reservation_cancelled: {
    reservation_id: string;
    reason?: string;
  };

  // --- Location de voiture ---
  search: {
    start_date: string;
    end_date: string;
    location: string;
  };
  booking_confirmed: {
    booking_id: string;
    vehicle_id: string;
    vehicle_category: string;
    value: number;
    days: number;
    currency?: string;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

// ---------------------------------------------------------------------------
// dataLayer helper (SSR-safe)
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

function pushToDataLayer<K extends AnalyticsEventName>(
  event: K,
  params: AnalyticsEventMap[K],
): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

// ---------------------------------------------------------------------------
// Hook useAnalytics
// ---------------------------------------------------------------------------

/**
 * Hook pour envoyer des events GA4 depuis les composants React.
 *
 * @example
 * const { track } = useAnalytics();
 * track("purchase", { transaction_id: "...", value: 42, currency: "EUR", items: [] });
 */
export function useAnalytics() {
  function track<K extends AnalyticsEventName>(event: K, params: AnalyticsEventMap[K]): void {
    pushToDataLayer(event, params);
  }

  return { track };
}

// ---------------------------------------------------------------------------
// Helper server-side pour les achats (appelé depuis une Server Action / API route)
// Pousse via GTM côté serveur si besoin, ou simplement retourne les données
// pour les passer au client.
// ---------------------------------------------------------------------------

export type PurchaseEventData = AnalyticsEventMap['purchase'];
export type BookingEventData = AnalyticsEventMap['booking_confirmed'];
export type ReservationEventData = AnalyticsEventMap['reservation_confirmed'];
