import type { UserProfile, Appointment, LoyaltyInfo, PromoOffer } from '@/types/salon';

/**
 * Données fictives du compte utilisateur — pour le développement frontend.
 *
 * TODO (backend) : remplacer par des appels API authentifiés.
 *   - mockUser → GET /api/account/profile
 *   - mockAppointments → GET /api/account/appointments
 *   - mockLoyalty → GET /api/account/loyalty
 */

export const mockUser: UserProfile = {
  id: 'user-001',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@email.com',
  phone: '0692 12 34 56',
  avatarUrl: 'https://picsum.photos/seed/user-marie/200/200',
  memberSince: '2024-06-15',
};

export const mockAppointments: Appointment[] = [
  /* ── À venir ─────────────────────────────────────────── */
  {
    id: 'apt-001',
    services: ['Coupe Femme', 'Brushing'],
    date: '2026-03-18',
    time: '10:30',
    durationMin: 75,
    price: 65,
    status: 'confirmed',
    stylistId: 'anais',
  },
  {
    id: 'apt-002',
    services: ['Soin Kératine Profond'],
    date: '2026-03-25',
    time: '14:00',
    durationMin: 120,
    price: 120,
    status: 'pending',
    stylistId: 'sarah',
  },
  /* ── Passés ──────────────────────────────────────────── */
  {
    id: 'apt-003',
    services: ['Couleur racines', 'Soin'],
    date: '2026-02-12',
    time: '15:00',
    durationMin: 90,
    price: 85,
    status: 'completed',
    stylistId: 'anais',
  },
  {
    id: 'apt-004',
    services: ['Coupe Femme', 'Brushing'],
    date: '2026-01-28',
    time: '10:00',
    durationMin: 60,
    price: 55,
    status: 'completed',
    stylistId: 'sarah',
    review: {
      rating: 5,
      comment: 'Super moment, merci Sarah pour les conseils !',
      createdAt: '2026-01-28T18:00:00Z',
    },
  },
  {
    id: 'apt-005',
    services: ['Balayage Signature'],
    date: '2025-12-15',
    time: '09:30',
    durationMin: 180,
    price: 130,
    status: 'completed',
    stylistId: 'marie-laure',
    review: {
      rating: 5,
      comment: 'Résultat magnifique, exactement ce que je voulais. Marie-Laure est une artiste !',
      createdAt: '2025-12-15T19:00:00Z',
    },
  },
  {
    id: 'apt-006',
    services: ['Lissage Brésilien'],
    date: '2025-11-02',
    time: '11:00',
    durationMin: 150,
    price: 150,
    status: 'completed',
    stylistId: 'fabrice',
  },
];

export const mockLoyalty: LoyaltyInfo = {
  currentVisits: 3,
  targetVisits: 8,
  reward: 'réduction de 10% sur la prestation de votre choix',
  discount: '-10%',
};

export const mockPromo: PromoOffer = {
  badge: 'OFFRE DU MOIS',
  title: 'Soin profond offert',
  description: "Pour toute réservation d'une prestation technique (couleur, balayage) en juin.",
  ctaLabel: 'En profiter',
  ctaHref: '/reserver',
};
