import type { ErrorEvent, EventHint } from '@sentry/nextjs';

/**
 * Filtre les erreurs non pertinentes avant envoi à Sentry.
 * À utiliser dans `beforeSend` de chaque config Sentry.
 * Type : ErrorEvent (sous-type de Event requis par beforeSend depuis @sentry/nextjs v10)
 */
export function sentryBeforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
  const error = hint.originalException;

  if (!(error instanceof Error)) return event;

  const message = error.message ?? '';

  // Erreurs réseau client (perte de connectivité, timeout) — bruit
  if (
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('Load failed') ||
    message.includes('Network request failed')
  ) {
    return null;
  }

  // Erreurs bots / crawlers qui injectent des scripts
  if (
    message.includes('Script error') ||
    message.includes('ResizeObserver loop') ||
    message.includes('Non-Error promise rejection')
  ) {
    return null;
  }

  // Extensions navigateur
  if (
    event.exception?.values?.some((v) =>
      v.stacktrace?.frames?.some(
        (f) =>
          f.filename?.startsWith('chrome-extension://') ||
          f.filename?.startsWith('moz-extension://'),
      ),
    )
  ) {
    return null;
  }

  return event;
}
