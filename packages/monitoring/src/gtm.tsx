import Script from 'next/script';

// ---------------------------------------------------------------------------
// Types globaux — window.gtag déclaré pour TypeScript
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer: unknown[];
    // gtag est créé par le snippet inline ci-dessous (fonction déclarée au top-level du script)
    gtag: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Consent Mode v2 — valeurs par défaut (REFUS avant consentement)
// Ce script DOIT être exécuté avant le chargement de GTM.
// Note : `function gtag(){}` au top-level d'un script crée automatiquement
// window.gtag (comportement standard des déclarations de fonction en JS).
// ---------------------------------------------------------------------------

const CONSENT_DEFAULTS_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
`.trim();

// ---------------------------------------------------------------------------
// Composant GtmProvider
// À placer dans le root layout, AVANT <body>.
// ---------------------------------------------------------------------------

interface GtmProviderProps {
  gtmId: string;
}

/**
 * Injecte Google Tag Manager avec Consent Mode v2 actif.
 *
 * Architecture :
 * 1. Script beforeInteractive → définit les defaults de consentement à "denied"
 *    et crée window.gtag (via déclaration de fonction au top-level)
 * 2. GTM charge → respecte ces defaults, ne tire pas les tags analytics tant
 *    que le consentement n'est pas accordé
 * 3. ConsentBanner → met à jour le consentement via window.gtag('consent', 'update', ...)
 */
export function GtmProvider({ gtmId }: GtmProviderProps) {
  if (!gtmId) return null;

  return (
    <>
      {/* 1. Consent defaults — synchrone, AVANT GTM */}
      <Script
        id="gtm-consent-defaults"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }}
      />

      {/* 2. GTM snippet (head) */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />
    </>
  );
}

/**
 * Fallback noscript pour GTM.
 * À placer comme premier enfant du <body>.
 */
export function GtmNoScript({ gtmId }: GtmProviderProps) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="GTM noscript"
      />
    </noscript>
  );
}

// ---------------------------------------------------------------------------
// Consent Mode v2 — mise à jour du consentement
// ---------------------------------------------------------------------------

export type ConsentState = 'granted' | 'denied';

export interface ConsentChoices {
  analytics: ConsentState;
  ads: ConsentState;
}

/**
 * Met à jour le Consent Mode v2 Google via window.gtag.
 * À appeler quand l'utilisateur accepte/refuse les cookies.
 *
 * Utilise window.gtag (créé par le snippet consent-defaults beforeInteractive)
 * qui appelle dataLayer.push(arguments) — la seule syntaxe correcte pour
 * les commandes de consentement GTM (IArguments, pas un tableau).
 */
export function updateGtmConsent(choices: ConsentChoices): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('consent', 'update', {
    analytics_storage: choices.analytics,
    ad_storage: choices.ads,
    ad_user_data: choices.ads,
    ad_personalization: choices.ads,
  });
}
