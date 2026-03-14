'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Users,
  UserSearch,
  Image,
  ShoppingBag,
  Clock,
  Star,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@marrynov/ui';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rdv', label: 'Rendez-vous', icon: CalendarCheck },
  { href: '/staff/clients', label: 'Clients', icon: UserSearch },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/equipe', label: 'Équipe', icon: Users },
  { href: '/admin/galerie', label: 'Galerie', icon: Image },
  { href: '/admin/produits', label: 'Produits', icon: ShoppingBag },
  { href: '/admin/horaires', label: 'Horaires', icon: Clock },
  { href: '/admin/avis', label: 'Avis', icon: Star },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

export function AdminSidebar({ salonName }: { salonName: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  const nav = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-primary/10 text-primary'
              : 'text-text-muted hover:bg-background hover:text-text',
          )}
        >
          <item.icon size={18} aria-hidden="true" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-border px-3 py-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-background hover:text-text"
      >
        <Home size={18} aria-hidden="true" />
        Retour au site
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-error/5 hover:text-error"
      >
        <LogOut size={18} aria-hidden="true" />
        Déconnexion
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="font-serif text-lg font-bold text-primary">
          {salonName}
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="cursor-pointer rounded-full p-2 text-text-muted hover:bg-background"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 cursor-pointer bg-black/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-dvh w-64 transform border-r border-border bg-surface transition-transform duration-200 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center px-6">
          <span className="font-serif text-lg font-bold text-primary">{salonName}</span>
        </div>
        <div className="flex h-[calc(100dvh-4rem)] flex-col justify-between">
          {nav}
          {footer}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:flex-col lg:border-r lg:border-border lg:bg-surface">
        <div className="flex h-16 items-center px-6">
          <Link href="/admin" className="font-serif text-lg font-bold text-primary">
            {salonName}
          </Link>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto">
          {nav}
          {footer}
        </div>
      </aside>
    </>
  );
}
