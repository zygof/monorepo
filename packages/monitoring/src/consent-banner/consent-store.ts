'use client';

import { useEffect, useState } from 'react';
import type { ConsentChoices } from '../gtm';
import { updateGtmConsent } from '../gtm';

const STORAGE_KEY = 'marrynov_consent_v1';
const CONSENT_DURATION_DAYS = 365;

export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'partial';

export interface StoredConsent {
  status: ConsentStatus;
  choices: ConsentChoices;
  timestamp: number;
}

function isExpired(timestamp: number): boolean {
  const expiresAt = timestamp + CONSENT_DURATION_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() > expiresAt;
}

function readStorage(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredConsent;
    if (isExpired(stored.timestamp)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

function writeStorage(consent: StoredConsent): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

// ---------------------------------------------------------------------------
// Hook useConsentStore
// ---------------------------------------------------------------------------

export function useConsentStore() {
  const [stored, setStored] = useState<StoredConsent | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const existing = readStorage();
    setStored(existing);
    setMounted(true);

    // Rejouer le consentement si déjà accordé (ex : retour sur le site)
    if (existing && existing.status !== 'pending') {
      updateGtmConsent(existing.choices);
    }
  }, []);

  function acceptAll(): void {
    const choices: ConsentChoices = { analytics: 'granted', ads: 'granted' };
    const consent: StoredConsent = {
      status: 'accepted',
      choices,
      timestamp: Date.now(),
    };
    writeStorage(consent);
    setStored(consent);
    updateGtmConsent(choices);
  }

  function rejectAll(): void {
    const choices: ConsentChoices = { analytics: 'denied', ads: 'denied' };
    const consent: StoredConsent = {
      status: 'rejected',
      choices,
      timestamp: Date.now(),
    };
    writeStorage(consent);
    setStored(consent);
    updateGtmConsent(choices);
  }

  function acceptAnalyticsOnly(): void {
    const choices: ConsentChoices = { analytics: 'granted', ads: 'denied' };
    const consent: StoredConsent = {
      status: 'partial',
      choices,
      timestamp: Date.now(),
    };
    writeStorage(consent);
    setStored(consent);
    updateGtmConsent(choices);
  }

  // Afficher la bannière uniquement si pas encore de décision
  const showBanner = mounted && stored === null;

  return { stored, showBanner, acceptAll, rejectAll, acceptAnalyticsOnly };
}
