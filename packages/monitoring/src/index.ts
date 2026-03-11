// Sentry utilities
export { sentryBeforeSend } from './sentry';

// Analytics
export { useAnalytics } from './analytics';
export type {
  AnalyticsEventMap,
  AnalyticsEventName,
  CartItem,
  PurchasedItem,
  PurchaseEventData,
  BookingEventData,
  ReservationEventData,
} from './analytics';

// GTM + Consent Mode v2
export { GtmProvider, GtmNoScript, updateGtmConsent } from './gtm';
export type { ConsentChoices, ConsentState } from './gtm';

// Consent Banner RGPD
export { ConsentBanner, useConsentStore } from './consent-banner';
export type { StoredConsent, ConsentStatus } from './consent-banner';
