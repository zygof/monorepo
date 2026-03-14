'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, Calendar, Heart, LogOut, ChevronDown, Shield, Scissors } from 'lucide-react';
import { Button } from '@marrynov/ui';
import { useAuthModal } from '@/components/providers';

/**
 * Menu utilisateur dans la navbar — Client Component.
 *
 * - Non connecté : bouton "Mon compte" → ouvre le modal auth
 * - Connecté : avatar/initiales + dropdown avec liens compte
 */
export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { openAuth } = useAuthModal();

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="hidden lg:flex h-9 w-9 items-center justify-center rounded-full border border-border bg-primary-light animate-pulse" />
    );
  }

  // Non connecté
  if (!session?.user) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="hidden lg:flex rounded-full border-border bg-primary-light hover:border-primary"
        aria-label="Mon compte"
        onClick={() => openAuth('login')}
      >
        <User size={16} aria-hidden="true" />
      </Button>
    );
  }

  // Connecté — initiales
  const user = session.user;
  const initials = `${(user.firstName?.[0] ?? '').toUpperCase()}${(user.lastName?.[0] ?? '').toUpperCase()}`;

  const role = user.role;
  const isStaff = role === 'EMPLOYEE' || role === 'ADMIN';
  const isAdmin = role === 'ADMIN';

  const menuItems = [
    { href: '/compte', label: 'Mon compte', icon: User },
    { href: '/compte?tab=appointments', label: 'Mes rendez-vous', icon: Calendar },
    { href: '/compte?tab=loyalty', label: 'Ma fidélité', icon: Heart },
  ];

  return (
    <div className="hidden lg:block relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-primary-light px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menu de mon compte"
      >
        {user.image ? (
          <img src={user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {initials}
          </span>
        )}
        <span className="max-w-[120px] truncate">{user.firstName ?? user.name}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-white py-2 shadow-card animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* Info user */}
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-text truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>

          {/* Liens */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text transition-colors hover:bg-primary-light hover:text-primary"
              >
                <item.icon size={16} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Liens staff/admin */}
          {isStaff && (
            <div className="border-t border-border py-1">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-light"
                >
                  <Shield size={16} aria-hidden="true" />
                  Administration
                </Link>
              )}
              <Link
                href="/staff"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-light"
              >
                <Scissors size={16} aria-hidden="true" />
                Espace styliste
              </Link>
            </div>
          )}

          {/* Déconnexion */}
          <div className="border-t border-border pt-1">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut size={16} aria-hidden="true" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
