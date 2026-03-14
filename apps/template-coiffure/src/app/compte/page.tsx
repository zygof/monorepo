import type { JSX } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AccountDashboard } from '@/components/account/account-dashboard';
import { salonConfig, teamMembers } from '@/config/salon.config';
import { mockUser, mockAppointments, mockLoyalty, mockPromo } from '@/config/account.mock';
import type { AccountTab } from '@/types/salon';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Mon Compte — ${salonConfig.name}`,
  description: `Gérez vos rendez-vous, votre profil et votre programme fidélité chez ${salonConfig.name}.`,
  robots: { index: false, follow: false },
};

/* ── Page ──────────────────────────────────────────────────────────────── */

const VALID_TABS: AccountTab[] = ['appointments', 'profile', 'loyalty'];

interface ComptePageProps {
  searchParams: Promise<{ tab?: string }>;
}

/**
 * Page Mon Compte — tableau de bord client.
 *
 * TODO (backend) : protéger cette page avec next-auth middleware.
 * Les données mockées seront remplacées par des appels API authentifiés.
 */
export default async function ComptePage({ searchParams }: ComptePageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const initialTab = VALID_TABS.includes(params.tab as AccountTab)
    ? (params.tab as AccountTab)
    : 'appointments';
  const { contact, bookingUrl } = salonConfig;
  const fullAddress = `${contact.address}, ${contact.postalCode} ${contact.city}`;

  return (
    <>
      <Header />

      <main id="main-content" className="bg-background">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-28 lg:px-14">
          <AccountDashboard
            user={mockUser}
            appointments={mockAppointments}
            loyalty={mockLoyalty}
            promo={mockPromo}
            teamMembers={teamMembers}
            bookingUrl={bookingUrl}
            phone={contact.phone}
            phoneRaw={contact.phoneRaw}
            whatsapp={contact.whatsapp}
            address={fullAddress}
            initialTab={initialTab}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
