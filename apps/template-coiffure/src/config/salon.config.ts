import type { SalonConfig, Service } from '@/types/salon';

/**
 * Configuration du salon — source de vérité unique.
 *
 * ⚠️  SEUL fichier à modifier pour adapter le template à un client.
 *
 * TODO (backend) : ces données statiques seront remplacées par des appels API.
 * Les types respectent déjà le contrat de réponse attendu.
 *   - salonConfig → GET /api/salon/config
 *   - featuredServices → GET /api/services?featured=true&limit=3
 */

export const salonConfig: SalonConfig = {
  name: 'Beauté Créole',
  shortName: 'Beauté Créole',
  tagline: 'Expertise Afro-Créole, résultats haut de gamme à La Réunion.',
  description:
    "Le salon premium de référence à La Réunion pour toutes les textures de cheveux. L'expertise Afro-Créole à votre service.",
  contact: {
    address: '123 Rue Jean Chatel',
    city: 'Saint-Denis',
    postalCode: '97400',
    region: 'La Réunion',
    phone: '0262 12 34 56',
    phoneRaw: '0262123456',
    whatsapp: '0262123456',
    email: 'contact@beautecreole.re',
    instagram: 'https://instagram.com/beautecreole',
    facebook: 'https://facebook.com/beautecreole',
    tiktok: 'https://tiktok.com/@beautecreole',
  },
  schedule: {
    Lundi: null,
    'Mardi - Vendredi': '09:00 - 18:30',
    Samedi: '08:30 - 17:00',
    Dimanche: null,
  },
  stats: {
    rating: 4.9,
    reviewCount: 312,
    yearsOpen: 8,
    speciality: 'Toutes textures',
  },
  navLinks: [
    { label: 'Accueil', href: '/' },
    { label: 'Services & Tarifs', href: '/services' },
    { label: 'Équipe', href: '/equipe' },
    { label: 'Galerie', href: '/galerie' },
    { label: 'Contact', href: '/contact' },
  ],
  bookingUrl: '/reserver',
  servicesUrl: '/services',
  copyright: '© 2025 Salon Beauté Créole. Tous droits réservés.',

  /* ── Contenu des sections ─────────────────────────────────────── */

  hero: {
    headingPart1: 'Expertise Afro-Créole,',
    headingGradient: 'résultats haut de gamme',
    headingPart2: 'à La Réunion.',
    description:
      'Révélez la beauté naturelle de vos cheveux avec nos soins sur-mesure. Une expérience premium dédiée à toutes les textures, du crépu au bouclé.',
    ctaPrimary: 'Prendre Rendez-vous',
    ctaSecondary: 'Découvrir nos services',
    urgencyCta: 'Réservez maintenant',
    /** TODO (backend) : remplacer par API disponibilités temps réel */
    urgencyMessage: '3 créneaux disponibles',
    urgencyDate: 'ce samedi',
    imageSrc: '/images/hero-salon.png',
    imageAlt: 'Salon Beauté Créole — intérieur élégant avec coiffeuse et miroir',
  },

  servicesSection: {
    heading: 'Nos Services Signatures',
    description:
      "Des prestations haut de gamme adaptées à chaque type de cheveux, réalisées avec des produits d'exception.",
    viewAllLabel: 'Voir tous nos tarifs et forfaits',
  },

  ctaBanner: {
    heading: 'Prête pour votre transformation\u00a0?',
    description:
      "Réservez votre moment de détente en quelques clics. Choisissez votre prestation, votre styliste et l'horaire qui vous convient.",
    buttonLabel: 'Réserver en 2 minutes',
  },

  footerLabels: {
    contactHeading: 'Contact',
    scheduleHeading: 'Horaires',
    linksHeading: 'Liens Rapides',
    bookOnline: 'Réserver en ligne',
    legalNotice: 'Mentions Légales',
    termsAndConditions: 'CGV',
    byline: 'Créé avec passion à La Réunion',
  },

  seo: {
    siteUrl: 'https://beautecreole.re',
    ogImageUrl: '/og-image.jpg',
    ogImageAlt: 'Beauté Créole — Salon de Coiffure Afro-Créole à La Réunion',
  },
};

/**
 * Services en avant sur la page d'accueil.
 * TODO (backend) : GET /api/services?featured=true&limit=3
 */
export const featuredServices: Service[] = [
  {
    id: 'coupe-brushing',
    slug: 'coupe-brushing',
    name: 'Coupe & Brushing',
    description:
      'Diagnostic personnalisé, soin profond, coupe sur mesure et coiffage adapté à votre texture.',
    startingPrice: 45,
    // TODO: remplacer par l'image réelle du service en production
    imageUrl: 'https://picsum.photos/seed/coupe-brushing/800/600',
    imageAlt: 'Coupe et brushing professionnel sur cheveux texturés',
    featured: false,
    category: 'coupe',
    durationMin: 60,
  },
  {
    id: 'balayage-signature',
    slug: 'balayage-signature',
    name: 'Balayage Signature',
    description:
      "Technique d'éclaircissement sur mesure respectueuse de la fibre capillaire, patine et soin inclus.",
    startingPrice: 120,
    // TODO: remplacer par l'image réelle du service en production
    imageUrl: 'https://picsum.photos/seed/balayage-signature/800/600',
    imageAlt: 'Balayage signature sur cheveux bouclés',
    featured: true,
    badge: 'Le plus demandé',
    category: 'coloration',
    durationMin: 180,
  },
  {
    id: 'soin-keratine-profond',
    slug: 'soin-keratine-profond',
    name: 'Soin Kératine Profond',
    description:
      'Traitement reconstructeur intense pour cheveux texturés, apporte brillance, souplesse et hydratation.',
    startingPrice: 85,
    // TODO: remplacer par l'image réelle du service en production
    imageUrl: 'https://picsum.photos/seed/keratine-profond/800/600',
    imageAlt: 'Soin kératine profond pour cheveux afro',
    featured: false,
    category: 'soin',
    durationMin: 120,
  },
];
