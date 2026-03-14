'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type {
  UserProfile,
  Appointment,
  LoyaltyInfo,
  PromoOffer,
  AccountTab,
  TeamMember,
} from '@/types/salon';
import { ProfileHeader } from './profile-header';
import { TabAppointments } from './tab-appointments';
import { TabProfile } from './tab-profile';
import { TabLoyalty } from './tab-loyalty';
import { LoyaltyWidget, QuickActionsWidget, PromoWidget } from './sidebar-widgets';

/* ── Props ────────────────────────────────────────────────────────────── */

interface AccountDashboardProps {
  user: UserProfile;
  appointments: Appointment[];
  loyalty: LoyaltyInfo;
  promo: PromoOffer;
  teamMembers: TeamMember[];
  bookingUrl: string;
  phone: string;
  phoneRaw: string;
  whatsapp?: string;
  address: string;
  initialTab?: AccountTab;
}

export function AccountDashboard({
  user,
  appointments,
  loyalty,
  promo,
  teamMembers,
  bookingUrl,
  phone,
  phoneRaw,
  whatsapp,
  address,
  initialTab = 'appointments',
}: AccountDashboardProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  const VALID_TABS: AccountTab[] = ['appointments', 'profile', 'loyalty'];

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && VALID_TABS.includes(tabParam as AccountTab)) {
      setActiveTab(tabParam as AccountTab);
    }
  }, [searchParams]);

  const fullAddress = address;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Profile Header + Tabs ────────────────────── */}
      <ProfileHeader
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onEditProfile={() => setActiveTab('profile')}
      />

      {/* ── Content area ─────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Main content */}
        <div>
          {activeTab === 'appointments' && (
            <TabAppointments
              appointments={appointments}
              teamMembers={teamMembers}
              bookingUrl={bookingUrl}
              salonPhone={phoneRaw}
            />
          )}
          {activeTab === 'profile' && <TabProfile user={user} />}
          {activeTab === 'loyalty' && <TabLoyalty loyalty={loyalty} />}
        </div>

        {/* Sidebar — visible on all tabs */}
        <aside className="flex flex-col gap-6" aria-label="Informations complémentaires">
          {/* Loyalty widget only on appointments/profile tab */}
          {activeTab !== 'loyalty' && (
            <LoyaltyWidget loyalty={loyalty} onNavigateToLoyalty={() => setActiveTab('loyalty')} />
          )}

          <QuickActionsWidget
            phone={phone}
            phoneRaw={phoneRaw}
            whatsapp={whatsapp}
            address={fullAddress}
          />

          <PromoWidget promo={promo} />
        </aside>
      </div>
    </div>
  );
}
