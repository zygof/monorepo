/**
 * Types du domaine salon de coiffure.
 *
 * Ces interfaces correspondent à ce que l'API retournera.
 * Les données statiques dans salon.config.ts respectent ces contrats.
 *
 * TODO (backend) : remplacer les données statiques par des fetch vers /api/salon/*
 */

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Prix de départ en euros */
  startingPrice: number;
  imageUrl: string;
  imageAlt: string;
  /** Met en avant ce service visuellement (bordure gold, CTA filled) */
  featured?: boolean;
  /** Badge affiché en bandeau (ex: "Le plus demandé") */
  badge?: string;
  /** Durée estimée en minutes */
  durationMin?: number;
  category?: ServiceCategory;
}

export type ServiceCategory =
  | 'coupe'
  | 'coloration'
  | 'soin'
  | 'coiffage'
  | 'lissage'
  | 'extensions'
  | 'evenement'
  | 'mariage';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  /** URL vers la fiche produit ou page d'achat externe */
  url?: string;
}

export interface EventPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Liste des prestations incluses */
  features: string[];
  featured?: boolean;
  badge?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialities: string[];
  /** Nombre d'années d'expérience */
  yearsExperience?: number;
  /** Citation / philosophie personnelle */
  quote?: string;
  instagram?: string;
}

/** Contenu de la section Équipe — configurable par client */
export interface TeamSectionContent {
  heading: string;
  description: string;
  valuesHeading: string;
  valuesDescription: string;
  values: TeamValue[];
}

export interface TeamValue {
  title: string;
  description: string;
}

/* ── Gallery Types ───────────────────────────────────────────────────── */

export type GalleryCategory =
  | 'balayage'
  | 'coupe'
  | 'lissage'
  | 'extensions'
  | 'mariage'
  | 'couleur'
  | 'soin';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  category: GalleryCategory;
  /** Titre court affiché en overlay */
  title: string;
  /** Description optionnelle */
  description?: string;
  /** Styliste qui a réalisé la prestation */
  stylistId?: string;
}

/** Contenu de la section Galerie — configurable par client */
export interface GallerySectionContent {
  heading: string;
  description: string;
}

export interface Schedule {
  /** null = fermé ce jour */
  [day: string]: string | null;
}

export interface ContactInfo {
  address: string;
  city: string;
  postalCode: string;
  region: string;
  phone: string;
  /** Numéro sans espaces pour le lien tel: */
  phoneRaw: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export interface SalonStats {
  rating: number;
  reviewCount: number;
  yearsOpen: number;
  speciality: string;
}

export interface NavLink {
  label: string;
  href: string;
}

/** Contenu de la section Hero — configurable par client */
export interface HeroContent {
  /** Première partie du H1 (avant le texte en dégradé) */
  headingPart1: string;
  /** Partie du H1 mise en valeur avec le dégradé brand */
  headingGradient: string;
  /** Deuxième ligne du H1, après le dégradé (optionnelle) */
  headingPart2?: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  urgencyCta: string;
  /** Texte d'urgence statique (ex: "3 créneaux disponibles") — TODO: remplacer par API */
  urgencyMessage: string;
  /** Date/période affichée (ex: "ce samedi") — TODO: remplacer par API */
  urgencyDate: string;
  imageSrc: string;
  imageAlt: string;
}

/** Contenu de la section Services — configurable par client */
export interface ServicesSectionContent {
  heading: string;
  description: string;
  viewAllLabel: string;
}

/** Contenu du bandeau CTA — configurable par client */
export interface CtaBannerContent {
  heading: string;
  description: string;
  buttonLabel: string;
}

/** Contenu de la page Contact — configurable par client */
export interface ContactSectionContent {
  heading: string;
  description: string;
  formHeading: string;
  formDescription: string;
  /** URL Google Maps embed (iframe src) */
  mapEmbedUrl: string;
  /** Texte affiché sous la carte */
  accessInfo: string;
}

/** Labels du footer — configurables pour localisation et client */
export interface FooterLabels {
  contactHeading: string;
  scheduleHeading: string;
  linksHeading: string;
  bookOnline: string;
  legalNotice: string;
  termsAndConditions: string;
  privacyPolicy: string;
  /** Ligne de crédits en bas à droite */
  byline: string;
}

/** Informations légales du professionnel — nécessaires pour les pages juridiques */
export interface LegalConfig {
  /** Nom complet du gérant / responsable */
  ownerName: string;
  /** Forme juridique (ex: Micro-entreprise, SAS, SARL) */
  legalForm: string;
  /** Numéro SIRET */
  siret: string;
  /** Numéro de TVA intracommunautaire (si applicable) */
  tvaNumber?: string;
  /** Nom de l'hébergeur web */
  hostName: string;
  /** Adresse de l'hébergeur */
  hostAddress: string;
  /** URL ou contact de l'hébergeur */
  hostContact: string;
  /** Date de dernière mise à jour des CGV/mentions légales (format: "1er mars 2026") */
  lastUpdated: string;
}

/** Configuration SEO — URLs et données Open Graph */
export interface SeoConfig {
  /** URL de base du site sans trailing slash (ex: https://beautecreole.re) */
  siteUrl: string;
  /** URL absolue de l'image Open Graph (1200x630 recommandé) */
  ogImageUrl: string;
  ogImageAlt: string;
}

/* ── Account Types ────────────────────────────────────────────────────── */

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  /** Date d'inscription (ISO) */
  memberSince: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  /** Nom(s) de la prestation */
  services: string[];
  /** Date du rendez-vous (ISO) */
  date: string;
  /** Heure (HH:MM) */
  time: string;
  /** Durée en minutes */
  durationMin: number;
  /** Prix total en euros */
  price: number;
  status: AppointmentStatus;
  /** ID du styliste */
  stylistId: string;
  /** Avis laissé par le client (optionnel) */
  review?: AppointmentReview;
}

export interface AppointmentReview {
  rating: number;
  comment: string;
  /** Date de l'avis (ISO) */
  createdAt: string;
}

export interface LoyaltyInfo {
  /** Nombre de visites effectuées */
  currentVisits: number;
  /** Nombre de visites nécessaires pour la récompense */
  targetVisits: number;
  /** Description de la récompense */
  reward: string;
  /** Réduction obtenue */
  discount: string;
}

export interface PromoOffer {
  /** Badge (ex: "OFFRE DU MOIS") */
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export type AccountTab = 'appointments' | 'profile' | 'loyalty';

/* ── Booking Types ────────────────────────────────────────────────────── */

export interface BookingContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  smsNotif: boolean;
  acceptCgv: boolean;
}

export type BookingStep = 1 | 2 | 3 | 'confirmed';

export interface BookingState {
  step: BookingStep;
  selectedServices: Service[];
  selectedProducts: Product[];
  /** 'any' = premier disponible, sinon TeamMember.id */
  stylistId: string;
  date: string | null; // 'YYYY-MM-DD'
  timeSlot: string | null; // 'HH:MM'
  contact: BookingContact;
}

export type BookingAction =
  | { type: 'TOGGLE_SERVICE'; service: Service }
  | { type: 'TOGGLE_PRODUCT'; product: Product }
  | { type: 'SET_STYLIST'; id: string }
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_TIME'; slot: string }
  | { type: 'SET_CONTACT_FIELD'; field: keyof BookingContact; value: string | boolean }
  | { type: 'GO_NEXT' }
  | { type: 'GO_PREV' }
  | { type: 'CONFIRM' };

/* ── SalonConfig ──────────────────────────────────────────────────────── */

export interface SalonConfig {
  name: string;
  /** Nom court pour le logo */
  shortName: string;
  tagline: string;
  description: string;
  contact: ContactInfo;
  schedule: Schedule;
  stats: SalonStats;
  navLinks: NavLink[];
  /** URL de la page de réservation (interne ou externe ex: Planity, Booksy) */
  bookingUrl: string;
  servicesUrl: string;
  copyright: string;
  /** Instructions affichées dans l'email et la page de confirmation du RDV */
  bookingInstructions?: string[];
  hero: HeroContent;
  servicesSection: ServicesSectionContent;
  ctaBanner: CtaBannerContent;
  teamSection: TeamSectionContent;
  gallerySection: GallerySectionContent;
  contactSection: ContactSectionContent;
  footerLabels: FooterLabels;
  seo: SeoConfig;
  legal: LegalConfig;
}
