'use client';

import { useState, useId } from 'react';
import { cn } from '@marrynov/ui';
import { ServiceCard } from '@/components/ui/service-card';
import type { Service, ServiceCategory } from '@/types/salon';

interface Tab {
  id: ServiceCategory | 'all';
  label: string;
}

const TABS: Tab[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'coupe', label: 'Coupes & Brushing' },
  { id: 'coloration', label: 'Couleur' },
  { id: 'soin', label: 'Soins' },
  { id: 'lissage', label: 'Lissage' },
  { id: 'extensions', label: 'Extensions' },
];

interface ServicesCatalogProps {
  services: Service[];
  bookingUrl: string;
}

/**
 * Catalogue de services avec filtre par onglets — Client Component.
 *
 * Extrait de la page (Server Component) pour isoler l'interactivité.
 * Filtre côté client (données statiques), pas de fetch supplémentaire.
 * TODO (backend) : passer à une URL query param + navigation Server pour SEO.
 */
export function ServicesCatalog({ services, bookingUrl }: ServicesCatalogProps) {
  const [activeTab, setActiveTab] = useState<ServiceCategory | 'all'>('all');
  const tabListId = useId();

  const filtered =
    activeTab === 'all' ? services : services.filter((s) => s.category === activeTab);

  return (
    <section aria-label="Catalogue de services" className="py-12">
      {/* Tabs */}
      <div className="mb-10 overflow-x-auto pb-1 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
        <div
          role="tablist"
          id={tabListId}
          aria-label="Filtrer par catégorie"
          className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-primary text-white shadow-sm cursor-default'
                    : 'bg-surface border border-border text-text-subtle hover:border-primary hover:text-primary',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-text-muted">Aucun service dans cette catégorie.</p>
        ) : (
          <ul
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={`Services ${activeTab === 'all' ? 'toutes catégories' : activeTab}`}
          >
            {filtered.map((service) => (
              <li key={service.id}>
                <ServiceCard service={service} bookingUrl={bookingUrl} className="h-full" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
