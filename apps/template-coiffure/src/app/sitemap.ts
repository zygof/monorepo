import type { MetadataRoute } from 'next';
import { salonConfig } from '@/config/salon.config';
import { hasBooking } from '@/lib/offers';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = salonConfig.seo.siteUrl;

  const pages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/equipe`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/galerie`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${base}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${base}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${base}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Standard+ : ajouter la page de réservation
  if (hasBooking()) {
    pages.push({
      url: `${base}/reserver`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  return pages;
}
