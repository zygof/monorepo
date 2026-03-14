'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook qui écoute les Server-Sent Events du backend et rafraîchit la page
 * automatiquement quand les données changent (nouveau RDV, annulation, note, etc.).
 *
 * Usage : useRealtimeRefresh() dans n'importe quel composant staff/admin.
 *
 * Le hook gère automatiquement :
 * - La connexion SSE
 * - La reconnexion avec backoff exponentiel (5s → 10s → 20s → 40s → 60s max)
 * - Le debounce de router.refresh() pour éviter les rafales
 * - Le nettoyage à la destruction du composant
 */
export function useRealtimeRefresh() {
  const router = useRouter();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const retryCountRef = useRef(0);

  const debouncedRefresh = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      router.refresh();
    }, 500);
  }, [router]);

  useEffect(() => {
    let mounted = true;

    function connect() {
      if (!mounted) return;

      // Fermer la connexion précédente
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const es = new EventSource('/api/staff/events');
      eventSourceRef.current = es;

      es.onopen = () => {
        // Réinitialiser le compteur de retry à la connexion réussie
        retryCountRef.current = 0;
      };

      es.onmessage = (event) => {
        if (!mounted) return;
        try {
          const data = JSON.parse(event.data);
          // Ignorer le message de connexion initiale
          if (data.type === 'connected') return;
          // Rafraîchir les données serveur (debounced)
          debouncedRefresh();
        } catch {
          // Ignorer les messages invalides
        }
      };

      es.onerror = () => {
        es.close();
        if (!mounted) return;
        // Backoff exponentiel : 5s, 10s, 20s, 40s, 60s max
        const delay = Math.min(5000 * Math.pow(2, retryCountRef.current), 60000);
        retryCountRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      mounted = false;
      eventSourceRef.current?.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [router, debouncedRefresh]);
}
