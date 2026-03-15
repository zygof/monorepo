'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@marrynov/ui';
import { AuthModal } from '@/components/auth/auth-modal';
import { hasAuth } from '@/lib/offers';

/* ── Auth Modal Context ─────────────────────────────────────────────── */

type AuthDefaultView = 'login' | 'signup';

interface AuthModalContextValue {
  openAuth: (view?: AuthDefaultView) => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue>({
  openAuth: () => {},
  closeAuth: () => {},
});

export function useAuthModal() {
  return useContext(AuthModalContext);
}

/* ── Providers ──────────────────────────────────────────────────────── */

/**
 * Providers racine — s'adapte au tier MARRYNOV.
 * Vitrine   : pas de SessionProvider ni AuthModal (pas d'auth).
 * Standard+ : SessionProvider + AuthModal.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const authEnabled = hasAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthDefaultView>('login');

  const openAuth = useCallback(
    (view: AuthDefaultView = 'login') => {
      if (!authEnabled) return;
      setAuthView(view);
      setAuthOpen(true);
    },
    [authEnabled],
  );

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
  }, []);

  // Vitrine : pas d'auth, wrapper minimal
  if (!authEnabled) {
    return (
      <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
        {children}
        <Toaster />
      </AuthModalContext.Provider>
    );
  }

  return (
    <SessionProvider>
      <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
        {children}
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultView={authView} />
        <Toaster />
      </AuthModalContext.Provider>
    </SessionProvider>
  );
}
