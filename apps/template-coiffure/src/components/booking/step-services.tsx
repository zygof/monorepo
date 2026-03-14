'use client';

import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, ShoppingBag, AlertCircle, Check } from 'lucide-react';
import { cn } from '@marrynov/ui';
import type { Service, Product, BookingAction, BookingState } from '@/types/salon';

const CATEGORY_ORDER = [
  'coupe',
  'coloration',
  'soin',
  'lissage',
  'extensions',
  'evenement',
  'mariage',
  'coiffage',
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  coupe: 'Coupes & Brushing',
  coloration: 'Couleur',
  soin: 'Soins',
  lissage: 'Lissage',
  extensions: 'Extensions & Nattage',
  evenement: 'Événements',
  mariage: 'Mariages',
  coiffage: 'Coiffage',
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`;
}

/** Durée maximum autorisée par journée de RDV (7h) */
const MAX_DURATION_MIN = 7 * 60;

interface ServiceRowProps {
  service: Service;
  selected: boolean;
  /** La prestation dépasserait le plafond journalier si ajoutée */
  wouldExceedLimit: boolean;
  onToggle: () => void;
}

function ServiceRow({ service, selected, wouldExceedLimit, onToggle }: ServiceRowProps) {
  const isDisabled = !selected && wouldExceedLimit;

  return (
    <li>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={isDisabled}
        onClick={onToggle}
        className={cn(
          'group w-full rounded-xl border p-4 text-left transition-all duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          selected && 'cursor-pointer border-primary bg-primary/5 shadow-sm',
          !selected &&
            !isDisabled &&
            'cursor-pointer border-border bg-surface hover:border-primary/40 hover:bg-primary/2',
          isDisabled && 'cursor-not-allowed border-border bg-surface opacity-45',
        )}
      >
        <div className="flex items-start gap-3">
          {/* Radio indicator (1 seul par catégorie) */}
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
              selected && 'border-primary bg-primary',
              !selected && !isDisabled && 'border-border bg-white group-hover:border-primary/50',
              isDisabled && 'border-border bg-primary-light',
            )}
            aria-hidden="true"
          >
            {selected && <span className="h-2 w-2 rounded-full bg-white" />}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text leading-snug">{service.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-subtle line-clamp-2">
                  {service.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-primary whitespace-nowrap">
                  {service.startingPrice}€
                </p>
                {service.durationMin && (
                  <p className="text-xs text-text-muted whitespace-nowrap flex items-center justify-end gap-0.5 mt-0.5">
                    <Clock size={10} aria-hidden="true" />
                    {formatDuration(service.durationMin)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {service.badge && (
          <span className="mt-2 ml-8 inline-block rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-medium text-secondary">
            {service.badge}
          </span>
        )}
      </button>
    </li>
  );
}

interface ProductRowProps {
  product: Product;
  selected: boolean;
  onToggle: () => void;
}

function ProductRow({ product, selected, onToggle }: ProductRowProps) {
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        onClick={onToggle}
        className={cn(
          'group w-full rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
          selected
            ? 'border-secondary bg-secondary/5 shadow-sm'
            : 'border-border bg-surface hover:border-secondary/40 hover:bg-secondary/[0.02]',
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
              selected
                ? 'border-secondary bg-secondary'
                : 'border-border bg-white group-hover:border-secondary/50',
            )}
            aria-hidden="true"
          >
            {selected && <Check size={12} className="text-white" strokeWidth={3} />}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  {product.brand}
                </p>
                <p className="text-sm font-semibold text-text leading-snug truncate">
                  {product.name}
                </p>
              </div>
              <span className="shrink-0 text-sm font-bold text-secondary">{product.price}€</span>
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}

interface StepServicesProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  services: Service[];
  products: Product[];
}

export function StepServices({ state, dispatch, services, products }: StepServicesProps) {
  const [productsOpen, setProductsOpen] = useState(state.selectedProducts.length > 0);

  // Group services by category, in defined order
  const grouped = CATEGORY_ORDER.reduce<Record<string, Service[]>>((acc, cat) => {
    const list = services.filter((s) => s.category === cat);
    if (list.length > 0) acc[cat] = list;
    return acc;
  }, {});

  const uncategorized = services.filter(
    (s) => !s.category || !CATEGORY_ORDER.includes(s.category as (typeof CATEGORY_ORDER)[number]),
  );
  if (uncategorized.length > 0) grouped['autre'] = uncategorized;

  // Cap journalier 7h
  const totalSelectedDuration = state.selectedServices.reduce(
    (sum, s) => sum + (s.durationMin ?? 60),
    0,
  );
  const remainingMin = MAX_DURATION_MIN - totalSelectedDuration;
  const isAtLimit = remainingMin <= 0;

  return (
    <section aria-labelledby="step-services-heading">
      <h2 id="step-services-heading" className="mb-1 text-2xl font-bold text-text font-serif">
        Choisissez vos prestations
      </h2>
      <p className="mb-6 text-sm text-text-subtle">
        Vous pouvez combiner plusieurs prestations sur un même rendez-vous — max 7h par journée.
      </p>

      {/* Bannière cap journalier */}
      {isAtLimit ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3.5"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-error" aria-hidden="true" />
          <div className="text-sm">
            <p className="font-semibold text-error">Durée maximum atteinte (7h)</p>
            <p className="text-text-subtle">
              Les prestations supplémentaires devront être réservées lors d&apos;une autre visite.
              {/* TODO (backend) : proposer automatiquement un 2e créneau */}
            </p>
          </div>
        </div>
      ) : remainingMin <= 90 && totalSelectedDuration > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-secondary/30 bg-secondary/5 px-4 py-3.5">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
          <p className="text-sm text-text-subtle">
            <span className="font-semibold text-text">
              Il reste {formatDuration(remainingMin)} de disponible
            </span>{' '}
            sur la journée — certaines prestations longues ne sont plus disponibles.
          </p>
        </div>
      ) : null}

      {/* Services grouped by category */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, list]) => (
          <div key={cat}>
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                {CATEGORY_LABELS[cat] ?? cat}
              </h3>
              <span className="text-xs text-text-muted italic">1 au maximum</span>
            </div>
            <ul className="space-y-2" aria-label={`Services ${CATEGORY_LABELS[cat] ?? cat}`}>
              {list.map((service) => {
                const selected = state.selectedServices.some((s) => s.id === service.id);
                const wouldExceed = !selected && (service.durationMin ?? 60) > remainingMin;
                return (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    selected={selected}
                    wouldExceedLimit={wouldExceed}
                    onToggle={() => dispatch({ type: 'TOGGLE_SERVICE', service })}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Products accordion */}
      <div className="mt-8 rounded-2xl border border-border overflow-hidden">
        <button
          type="button"
          aria-expanded={productsOpen}
          aria-controls="products-panel"
          onClick={() => setProductsOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between bg-surface px-5 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-secondary" aria-hidden="true" />
            <span className="text-sm font-semibold text-text">Ajouter des produits beauté</span>
            {state.selectedProducts.length > 0 && (
              <span className="rounded-full bg-secondary text-white text-xs px-2 py-0.5 font-medium">
                {state.selectedProducts.length}
              </span>
            )}
          </div>
          <span className="text-text-muted" aria-hidden="true">
            {productsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {productsOpen && (
          <div id="products-panel" className="border-t border-border bg-white px-5 py-4">
            <p className="mb-4 text-xs text-text-subtle">
              Ces produits professionnels seront disponibles à votre passage en salon. Nos stylistes
              vous conseilleront lors de votre visite.
            </p>
            <ul className="space-y-2" aria-label="Produits beauté disponibles">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  selected={state.selectedProducts.some((p) => p.id === product.id)}
                  onToggle={() => dispatch({ type: 'TOGGLE_PRODUCT', product })}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      {state.selectedServices.length === 0 && (
        <p className="mt-4 text-center text-sm text-text-muted" role="status" aria-live="polite">
          Sélectionnez au moins une prestation pour continuer.
        </p>
      )}
    </section>
  );
}
