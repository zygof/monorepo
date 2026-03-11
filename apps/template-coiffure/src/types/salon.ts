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

export type ServiceCategory = 'coupe' | 'coloration' | 'soin' | 'coiffage' | 'mariage';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  specialities: string[];
  instagram?: string;
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

/** Labels du footer — configurables pour localisation et client */
export interface FooterLabels {
  contactHeading: string;
  scheduleHeading: string;
  linksHeading: string;
  bookOnline: string;
  legalNotice: string;
  termsAndConditions: string;
  /** Ligne de crédits en bas à droite */
  byline: string;
}

/** Configuration SEO — URLs et données Open Graph */
export interface SeoConfig {
  /** URL de base du site sans trailing slash (ex: https://beautecreole.re) */
  siteUrl: string;
  /** URL absolue de l'image Open Graph (1200x630 recommandé) */
  ogImageUrl: string;
  ogImageAlt: string;
}

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
  hero: HeroContent;
  servicesSection: ServicesSectionContent;
  ctaBanner: CtaBannerContent;
  footerLabels: FooterLabels;
  seo: SeoConfig;
}
