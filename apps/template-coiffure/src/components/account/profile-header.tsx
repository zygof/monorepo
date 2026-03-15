'use client';

import Image from 'next/image';
import { Mail, Phone, Pencil, User } from 'lucide-react';
import { Button, cn } from '@marrynov/ui';
import type { UserProfile, AccountTab } from '@/types/salon';

/* ── Tab config ──────────────────────────────────────────────────────── */

const TABS: { id: AccountTab; label: string; icon: React.ReactNode }[] = [
  { id: 'appointments', label: 'Mes Rendez-vous', icon: <span aria-hidden="true">📅</span> },
  { id: 'profile', label: 'Mon Profil', icon: <span aria-hidden="true">👤</span> },
  { id: 'loyalty', label: 'Fidélité', icon: <span aria-hidden="true">🏆</span> },
];

/* ── Props ────────────────────────────────────────────────────────────── */

interface ProfileHeaderProps {
  user: UserProfile;
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  onEditProfile: () => void;
}

export function ProfileHeader({ user, activeTab, onTabChange, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-card bg-linear-to-br from-primary/10 via-secondary/5 to-surface">
      {/* Profile info */}
      <div className="relative px-6 pb-4 pt-6 sm:px-8">
        {/* Avatar + infos */}
        <div className="mb-4 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-surface bg-primary-light shadow-card">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User size={32} className="text-primary" />
                </div>
              )}
            </div>
            <div className="mb-1">
              <h1 className="font-serif text-2xl font-bold text-text">
                {user.firstName} {user.lastName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-subtle">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-primary" aria-hidden="true" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" aria-hidden="true" />
                  {user.phone}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onEditProfile}
            className="hidden cursor-pointer gap-1.5 rounded-xl sm:inline-flex"
          >
            <Pencil size={14} aria-hidden="true" />
            Modifier le profil
          </Button>
        </div>

        {/* Mobile edit button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onEditProfile}
          className="mb-4 w-full cursor-pointer gap-1.5 rounded-xl sm:hidden"
        >
          <Pencil size={14} aria-hidden="true" />
          Modifier le profil
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-t border-border">
        <nav aria-label="Navigation du compte" className="flex overflow-x-auto px-4 sm:px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex shrink-0 cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text hover:border-border',
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
