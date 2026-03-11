import type { SalonConfig, Service, EventPackage, Product, TeamMember } from '@/types/salon';

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
    { label: 'Services & Tarifs', href: '/services' },
    { label: 'Équipe', href: '/equipe' },
    { label: 'Galerie', href: '/galerie' },
    { label: 'Contact', href: '/contact' },
  ],
  bookingUrl: '/reserver',
  servicesUrl: '/services',
  copyright: '© 2025 Salon Beauté Créole. Tous droits réservés.',
  bookingInstructions: [
    "Merci d'arriver 5 minutes avant l'heure prévue.",
    'Parking disponible à proximité (Parking République).',
    "En cas d'empêchement, merci de nous prévenir 24h à l'avance.",
  ],

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
 * Catalogue complet des services — page /services.
 * TODO (backend) : GET /api/services
 */
export const allServices: Service[] = [
  /* ── Coupes ─────────────────────────────────────────── */
  {
    id: 'coupe-brushing',
    slug: 'coupe-brushing',
    name: 'Coupe & Brushing',
    description:
      'Diagnostic personnalisé, soin profond, coupe sur mesure et coiffage adapté à votre texture.',
    startingPrice: 45,
    imageUrl: 'https://picsum.photos/seed/coupe-brushing/800/600',
    imageAlt: 'Coupe et brushing professionnel sur cheveux texturés',
    category: 'coupe',
    durationMin: 60,
  },
  {
    id: 'coupe-enfant',
    slug: 'coupe-enfant',
    name: 'Coupe Enfant',
    description:
      "Coupe adaptée aux enfants jusqu'à 12 ans, dans une ambiance douce et bienveillante.",
    startingPrice: 25,
    imageUrl: 'https://picsum.photos/seed/coupe-enfant/800/600',
    imageAlt: 'Coupe enfant dans un salon de coiffure',
    category: 'coupe',
    durationMin: 30,
  },
  {
    id: 'coupe-homme',
    slug: 'coupe-homme',
    name: 'Coupe Homme',
    description: 'Coupe et contour pour hommes, avec soin du cuir chevelu et finitions soignées.',
    startingPrice: 30,
    imageUrl: 'https://picsum.photos/seed/coupe-homme/800/600',
    imageAlt: 'Coupe homme professionnelle',
    category: 'coupe',
    durationMin: 30,
  },
  /* ── Couleur ─────────────────────────────────────────── */
  {
    id: 'balayage-signature',
    slug: 'balayage-signature',
    name: 'Balayage Signature',
    description:
      "Technique d'éclaircissement sur mesure respectueuse de la fibre capillaire, patine et soin inclus.",
    startingPrice: 120,
    imageUrl: 'https://picsum.photos/seed/balayage-signature/800/600',
    imageAlt: 'Balayage signature sur cheveux bouclés',
    featured: true,
    badge: 'Le plus demandé',
    category: 'coloration',
    durationMin: 180,
  },
  {
    id: 'couleur-complete',
    slug: 'couleur-complete',
    name: 'Couleur Complète',
    description:
      'Colorisation uniforme et éclatante, soin repigmentant inclus pour un résultat longue durée.',
    startingPrice: 80,
    imageUrl: 'https://picsum.photos/seed/couleur-complete/800/600',
    imageAlt: 'Couleur complète sur cheveux afro',
    category: 'coloration',
    durationMin: 120,
  },
  {
    id: 'meches-californiennes',
    slug: 'meches-californiennes',
    name: 'Mèches Californiennes',
    description:
      'Effet soleil naturel et lumineux, technique freehand adaptée à toutes les textures.',
    startingPrice: 150,
    imageUrl: 'https://picsum.photos/seed/meches-cali/800/600',
    imageAlt: 'Mèches californiennes sur cheveux bouclés',
    category: 'coloration',
    durationMin: 240,
  },
  /* ── Soins ────────────────────────────────────────────── */
  {
    id: 'soin-keratine-profond',
    slug: 'soin-keratine-profond',
    name: 'Soin Kératine Profond',
    description:
      'Traitement reconstructeur intense pour cheveux texturés, apporte brillance, souplesse et hydratation.',
    startingPrice: 85,
    imageUrl: 'https://picsum.photos/seed/keratine-profond/800/600',
    imageAlt: 'Soin kératine profond pour cheveux afro',
    category: 'soin',
    durationMin: 120,
  },
  {
    id: 'soin-hydratation',
    slug: 'soin-hydratation',
    name: 'Soin Hydratation Intense',
    description:
      'Masque capillaire concentré en actifs nourrissants pour cheveux secs et fragilisés.',
    startingPrice: 55,
    imageUrl: 'https://picsum.photos/seed/soin-hydratation/800/600',
    imageAlt: 'Soin hydratation intense en salon',
    category: 'soin',
    durationMin: 60,
  },
  {
    id: 'soin-cuir-chevelu',
    slug: 'soin-cuir-chevelu',
    name: 'Soin Cuir Chevelu',
    description:
      'Diagnostic et traitement ciblé : pellicules, irritations, fragilité du cheveu à la racine.',
    startingPrice: 40,
    imageUrl: 'https://picsum.photos/seed/soin-cuir/800/600',
    imageAlt: 'Soin du cuir chevelu professionnel',
    category: 'soin',
    durationMin: 45,
  },
  /* ── Lissage ─────────────────────────────────────────── */
  {
    id: 'lissage-bresilien',
    slug: 'lissage-bresilien',
    name: 'Lissage Brésilien',
    description:
      'Traitement lissant longue durée à la kératine, élimine les frisottis sans agresser la fibre.',
    startingPrice: 180,
    imageUrl: 'https://picsum.photos/seed/lissage-bresilien/800/600',
    imageAlt: 'Lissage brésilien sur cheveux crépu',
    category: 'lissage',
    durationMin: 240,
    badge: 'Résultat 3 mois',
  },
  {
    id: 'lissage-japonais',
    slug: 'lissage-japonais',
    name: 'Lissage Japonais',
    description: 'Lissage permanent ultra-lisse et brillant, idéal pour les cheveux récalcitrants.',
    startingPrice: 200,
    imageUrl: 'https://picsum.photos/seed/lissage-japonais/800/600',
    imageAlt: 'Lissage japonais sur cheveux texturés',
    category: 'lissage',
    durationMin: 300,
  },
  {
    id: 'defrisage',
    slug: 'defrisage',
    name: 'Défrisage',
    description:
      'Détente chimique précise, adaptée aux textures afro et crépu, avec soin réparateur post-traitement.',
    startingPrice: 90,
    imageUrl: 'https://picsum.photos/seed/defrisage/800/600',
    imageAlt: 'Défrisage professionnel en salon',
    category: 'lissage',
    durationMin: 120,
  },
  /* ── Extensions ──────────────────────────────────────── */
  {
    id: 'extensions-naturelles',
    slug: 'extensions-naturelles',
    name: 'Extensions Naturelles',
    description:
      "Pose d'extensions en cheveux naturels pour plus de longueur et de volume, rendu invisible.",
    startingPrice: 250,
    imageUrl: 'https://picsum.photos/seed/extensions-nat/800/600',
    imageAlt: "Pose d'extensions naturelles en salon",
    category: 'extensions',
    durationMin: 300,
    featured: true,
    badge: 'Premium',
  },
  {
    id: 'nattage-africain',
    slug: 'nattage-africain',
    name: 'Nattage Africain',
    description:
      'Nattes plates, cornrows ou box braids, réalisées avec soin pour protéger vos cheveux naturels.',
    startingPrice: 150,
    imageUrl: 'https://picsum.photos/seed/nattage/800/600',
    imageAlt: 'Nattage africain professionnel',
    category: 'extensions',
    durationMin: 180,
  },
  {
    id: 'tissage',
    slug: 'tissage',
    name: 'Tissage',
    description:
      'Pose de tissage sur tresses, technique protectrice qui préserve vos cheveux naturels.',
    startingPrice: 200,
    imageUrl: 'https://picsum.photos/seed/tissage/800/600',
    imageAlt: 'Pose de tissage en salon',
    category: 'extensions',
    durationMin: 240,
  },
];

/**
 * Forfaits événements — Mariage, cérémonie, shooting.
 * TODO (backend) : GET /api/event-packages
 */
export const eventPackages: EventPackage[] = [
  {
    id: 'forfait-mariage',
    name: 'Forfait Mariée',
    description: 'Une journée parfaite commence par une coiffure de rêve. Essai inclus.',
    price: 290,
    featured: true,
    badge: 'Le plus choisi',
    features: [
      'Essai de coiffure (J-15)',
      'Coiffure jour J',
      'Retouches en fin de matinée',
      'Accessoires cheveux offerts',
      'Conseil personnalisé',
    ],
  },
  {
    id: 'forfait-invite',
    name: 'Coiffure Invitée',
    description: 'Soyez rayonnante lors de chaque cérémonie avec un coiffage luxueux.',
    price: 75,
    features: ['Mise en forme sur mesure', 'Coiffage et laquage', 'Finitions soignées'],
  },
  {
    id: 'forfait-shooting',
    name: 'Shooting Photo',
    description: 'Coiffure adaptée aux contraintes lumières studio et plein air.',
    price: 65,
    features: ['Coiffage adapté caméra', 'Retouches sur place', 'Conseils styliste'],
  },
];

/**
 * Produits beauté vendus en salon.
 * TODO (backend) : GET /api/products
 */
export const beautyProducts: Product[] = [
  {
    id: 'huile-coco-ranova',
    name: 'Huile de Coco Pure',
    brand: 'Ranova',
    description: 'Hydratation intense et brillance naturelle pour cheveux crépus et bouclés.',
    price: 29,
    imageUrl: 'https://picsum.photos/seed/huile-coco/400/400',
    imageAlt: "Flacon d'huile de coco Ranova",
    badge: 'Best-seller',
  },
  {
    id: 'masque-reconstructeur-lp',
    name: 'Masque Reconstructeur Pro Longer',
    brand: "L'Oréal Professionnel",
    description:
      'Repare en profondeur les longueurs fragilisées. Résultat visible dès le 1er lavage.',
    price: 45,
    imageUrl: 'https://picsum.photos/seed/masque-lp/400/400',
    imageAlt: "Masque reconstructeur L'Oréal Professionnel",
  },
  {
    id: 'shampoing-hydratant',
    name: 'Shampoing Hydratation Intense',
    brand: 'Kérastase',
    description:
      'Nettoie en douceur tout en apportant une hydratation profonde aux fibres asséchées.',
    price: 32,
    imageUrl: 'https://picsum.photos/seed/shampoing/400/400',
    imageAlt: 'Flacon de shampoing hydratant Kérastase',
  },
  {
    id: 'serum-anti-frisottis',
    name: 'Sérum Anti-Frisottis',
    brand: 'Moroccanoil',
    description: 'Discipline les boucles rebelles et apporte une brillance miroir sans alourdir.',
    price: 38,
    imageUrl: 'https://picsum.photos/seed/serum/400/400',
    imageAlt: 'Sérum anti-frisottis Moroccanoil',
    badge: 'Nouveau',
  },
  {
    id: 'beurre-karite',
    name: 'Beurre de Karité Pur',
    brand: 'Shea Moisture',
    description:
      'Soin ultra-nourrissant 100% naturel pour les cheveux très secs et le cuir chevelu.',
    price: 18,
    imageUrl: 'https://picsum.photos/seed/karite/400/400',
    imageAlt: 'Pot de beurre de karité Shea Moisture',
  },
  {
    id: 'spray-protecteur',
    name: 'Spray Protecteur Chaleur',
    brand: 'Redken',
    description: "Protège jusqu'à 450°C, lisse et facilite le coiffage sans résidu lourd.",
    price: 28,
    imageUrl: 'https://picsum.photos/seed/spray-protecteur/400/400',
    imageAlt: 'Spray protecteur chaleur Redken',
  },
];

/**
 * Équipe du salon — utilisée pour la sélection du styliste lors du booking.
 * TODO (backend) : GET /api/team
 */
export const teamMembers: TeamMember[] = [
  {
    id: 'marie-laure',
    name: 'Marie-Laure K.',
    role: 'Coiffeuse Senior',
    bio: 'Experte en colorations, balayage et soins sur cheveux texturés.',
    imageUrl: 'https://picsum.photos/seed/stylist-ml/200/200',
    specialities: ['Balayage', 'Couleur', 'Soins'],
  },
  {
    id: 'sandra',
    name: 'Sandra R.',
    role: 'Technicienne Extensions',
    bio: 'Spécialiste en extensions naturelles, nattage et tissage.',
    imageUrl: 'https://picsum.photos/seed/stylist-sr/200/200',
    specialities: ['Extensions', 'Nattage', 'Tissage'],
  },
  {
    id: 'fabrice',
    name: 'Fabrice M.',
    role: 'Expert Coupes & Lissage',
    bio: 'Expert en coupes, soins et traitements lissants pour toutes textures.',
    imageUrl: 'https://picsum.photos/seed/stylist-fm/200/200',
    specialities: ['Coupes', 'Lissage', 'Soins'],
  },
];

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
