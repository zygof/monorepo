import type { NextMiddleware } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import type { OfferTier } from '@/lib/offers';

const VALID_TIERS: OfferTier[] = ['standard', 'expert', 'premium'];

function getTier(): OfferTier {
  const raw = process.env.NEXT_PUBLIC_OFFER_TIER;
  if (raw && VALID_TIERS.includes(raw as OfferTier)) return raw as OfferTier;
  return 'expert';
}

/**
 * Middleware d'authentification + filtrage par offre.
 *
 * Standard : bloque /reserver, /compte, /admin, /staff + APIs associées.
 * Expert+  : protège /compte (auth), /admin (ADMIN), /staff (EMPLOYEE|ADMIN).
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const tier = getTier();

  // ── Tier Standard : bloquer les routes Expert/Premium ──────────────
  if (tier === 'standard') {
    const blockedPaths = ['/reserver', '/compte', '/admin', '/staff', '/reset-password'];
    const isBlocked =
      blockedPaths.some((p) => pathname.startsWith(p)) ||
      pathname.startsWith('/api/bookings') ||
      pathname.startsWith('/api/admin') ||
      pathname.startsWith('/api/staff') ||
      pathname.startsWith('/api/account') ||
      pathname.startsWith('/api/me') ||
      pathname.startsWith('/api/auth/register');

    if (isBlocked) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Fonctionnalité non disponible dans cette offre' },
          { status: 403 },
        );
      }
      return NextResponse.redirect(new URL('/contact', req.nextUrl.origin));
    }
    return undefined;
  }

  // ── Expert / Premium : logique d'auth classique ────────────────────
  const isAuthenticated = !!req.auth;

  const protectedPaths = ['/compte', '/admin', '/staff'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/', req.nextUrl.origin);
    loginUrl.searchParams.set('auth', 'login');
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // Routes admin (pages + API) — vérifier le rôle
  if (
    (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) &&
    req.auth?.user?.role !== 'ADMIN'
  ) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }
    return Response.redirect(new URL('/', req.nextUrl.origin));
  }

  // Routes staff (pages + API) — vérifier le rôle
  if (pathname.startsWith('/staff') || pathname.startsWith('/api/staff')) {
    const role = req.auth?.user?.role;
    if (role !== 'EMPLOYEE' && role !== 'ADMIN') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Accès réservé au personnel' }, { status: 403 });
      }
      return Response.redirect(new URL('/', req.nextUrl.origin));
    }
  }

  return undefined;
}) as unknown as NextMiddleware;

export const config = {
  matcher: [
    '/reserver/:path*',
    '/compte/:path*',
    '/admin/:path*',
    '/staff/:path*',
    '/reset-password/:path*',
    '/api/admin/:path*',
    '/api/staff/:path*',
    '/api/bookings/:path*',
    '/api/account/:path*',
    '/api/me/:path*',
    '/api/auth/register',
  ],
};
