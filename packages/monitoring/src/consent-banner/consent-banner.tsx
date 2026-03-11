'use client';

import { useState } from 'react';
import { useConsentStore } from './consent-store';

/**
 * Bannière de consentement cookies conforme RGPD / CNIL.
 * Implémente le Consent Mode v2 Google.
 *
 * Fonctionnement :
 * - Apparaît au premier chargement (pas de cookie existant)
 * - Mémorise le choix 365 jours en localStorage
 * - Met à jour GTM via `gtag('consent', 'update', ...)`
 * - "Tout refuser" est aussi accessible que "Tout accepter" (exigence CNIL)
 */
export function ConsentBanner() {
  const { showBanner, acceptAll, rejectAll, acceptAnalyticsOnly } = useConsentStore();
  const [showDetails, setShowDetails] = useState(false);

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Gestion des cookies"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'var(--color-dark, #2c3e50)',
        color: '#fff',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <p
          style={{
            margin: '0 0 0.75rem',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            opacity: 0.9,
          }}
        >
          Nous utilisons des cookies pour mesurer notre audience et améliorer votre expérience
          (Google Analytics). Aucune donnée personnelle identifiable n&apos;est transmise.{' '}
          <a
            href="/politique-confidentialite"
            style={{ color: 'var(--color-accent, #e67e22)', textDecoration: 'underline' }}
          >
            En savoir plus
          </a>
        </p>

        {showDetails && (
          <div
            style={{
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
            }}
          >
            <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Détail des cookies</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', opacity: 0.85 }}>
              <li>
                <strong>Google Analytics (GA4)</strong> — mesure d&apos;audience anonymisée (pages
                visitées, durée, source du trafic)
              </li>
              <li>
                <strong>Google Ads</strong> — suivi des conversions publicitaires (si vous avez
                cliqué sur une annonce)
              </li>
            </ul>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          {/* Tout refuser — aussi visible que accepter (CNIL) */}
          <button
            onClick={rejectAll}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Tout refuser
          </button>

          {/* Personnaliser */}
          <button
            onClick={() => setShowDetails((v) => !v)}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {showDetails ? 'Masquer les détails' : 'Personnaliser'}
          </button>

          {showDetails && (
            <button
              onClick={acceptAnalyticsOnly}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '4px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Analytics uniquement
            </button>
          )}

          {/* Tout accepter */}
          <button
            onClick={acceptAll}
            style={{
              padding: '0.5rem 1.25rem',
              background: 'var(--color-primary, #6b40a0)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginLeft: 'auto',
            }}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
