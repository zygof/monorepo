'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster MARRYNOV — wrapper sonner avec design tokens.
 *
 * Utilise les CSS variables du design system pour s'adapter
 * automatiquement au branding de chaque client.
 *
 * Usage : placer <Toaster /> dans le layout ou providers racine.
 * Déclencher un toast : import { toast } from 'sonner'
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        className: 'font-sans',
        style: {
          '--normal-bg': 'var(--color-surface, #ffffff)',
          '--normal-text': 'var(--color-text, #1e1e1e)',
          '--normal-border': 'var(--color-border, #e5e5e5)',
          '--success-bg': '#f0fdf4',
          '--success-text': '#166534',
          '--success-border': '#bbf7d0',
          '--error-bg': '#fef2f2',
          '--error-text': '#991b1b',
          '--error-border': '#fecaca',
          borderRadius: '12px',
          fontSize: '14px',
        } as React.CSSProperties,
      }}
    />
  );
}

// Re-export toast pour usage direct depuis @marrynov/ui
export { toast } from 'sonner';
