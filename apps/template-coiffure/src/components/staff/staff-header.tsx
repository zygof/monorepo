'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Scissors, LogOut, Home, Users } from 'lucide-react';
import { Button } from '@marrynov/ui';

export function StaffHeader({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo + titre */}
        <Link href="/staff" className="flex items-center gap-2">
          <Scissors size={20} className="text-primary" aria-hidden="true" />
          <span className="font-serif text-lg font-bold text-primary">Espace Styliste</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/staff"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
          >
            Planning
          </Link>
          <Link
            href="/staff/clients"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-primary-light hover:text-primary"
          >
            <Users size={14} aria-hidden="true" />
            Clients
          </Link>
        </nav>

        {/* Info user + actions */}
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-text-muted sm:block">{userName}</span>
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Retour au site"
            >
              <Home size={18} aria-hidden="true" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-text-muted hover:text-error"
            onClick={() => signOut({ callbackUrl: '/' })}
            aria-label="Se déconnecter"
          >
            <LogOut size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
