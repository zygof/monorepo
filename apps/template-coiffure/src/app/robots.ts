import type { MetadataRoute } from 'next';
import { salonConfig } from '@/config/salon.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/staff/', '/compte/', '/reset-password/'],
    },
    sitemap: `${salonConfig.seo.siteUrl}/sitemap.xml`,
  };
}
