import type { JSX } from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { BookingWizard } from '@/components/booking/booking-wizard';
import { salonConfig, allServices, beautyProducts } from '@/config/salon.config';

export const metadata: Metadata = {
  title: `Réserver — ${salonConfig.name}`,
  description: `Prenez rendez-vous en ligne au salon ${salonConfig.name} à ${salonConfig.contact.city}. Choisissez votre prestation, votre styliste et votre créneau en quelques clics.`,
  robots: { index: false }, // pages de réservation non indexées (données personnelles)
};

interface ReserverPageProps {
  searchParams: Promise<{ service?: string; product?: string }>;
}

export default async function ReserverPage({
  searchParams,
}: ReserverPageProps): Promise<JSX.Element> {
  const { service: serviceSlug, product: productId } = await searchParams;

  const preService = serviceSlug ? allServices.find((s) => s.slug === serviceSlug) : undefined;
  const preProduct = productId ? beautyProducts.find((p) => p.id === productId) : undefined;

  const { contact, name, bookingInstructions } = salonConfig;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-20 bg-background">
        <BookingWizard
          preService={preService}
          preProduct={preProduct}
          salonName={name}
          phone={contact.phone}
          phoneRaw={contact.phoneRaw}
          whatsapp={contact.whatsapp}
          address={`${contact.address}, ${contact.city}`}
          bookingInstructions={bookingInstructions}
        />
      </main>
    </>
  );
}
