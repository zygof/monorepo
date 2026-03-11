import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button, Badge, cn } from '@marrynov/ui';
import type { Product } from '@/types/salon';

interface ProductCardProps {
  product: Product;
  bookingUrl?: string;
  className?: string;
}

/**
 * Carte produit beauté — vendu en salon ou en ligne.
 * Affiche image, marque, nom, description et prix.
 * CTA "Disponible en salon" (pas de panier e-commerce pour l'instant).
 */
export function ProductCard({ product, bookingUrl, className }: ProductCardProps): JSX.Element {
  const { name, brand, description, price, imageUrl, imageAlt, badge, url } = product;
  const headingId = `product-${product.id}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'relative flex flex-col rounded-2xl bg-surface border border-border',
        'shadow-card transition-shadow duration-300 hover:shadow-card-hover',
        className,
      )}
    >
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="px-3 py-0.5 text-xs rounded-full shadow-sm">
            {badge}
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden rounded-t-2xl bg-primary-light">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={80}
        />
        {/* Prix flottant */}
        <div className="absolute right-3 bottom-3 z-10">
          <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-secondary backdrop-blur-sm shadow-sm">
            {price}€
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">{brand}</p>
        <h3 id={headingId} className="mb-2 text-base font-bold text-text leading-snug">
          {name}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-text-subtle">{description}</p>

        {url ? (
          <Button
            asChild
            variant="outline"
            size="pill-sm"
            className="w-full border-primary text-primary hover:bg-primary-light"
          >
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <ShoppingBag size={14} aria-hidden="true" />
              Commander en ligne
            </Link>
          </Button>
        ) : bookingUrl ? (
          <Button
            asChild
            variant="outline"
            size="pill-sm"
            className="w-full border-secondary text-secondary hover:bg-secondary/5"
          >
            <Link href={`${bookingUrl}?product=${product.id}`}>
              <ShoppingBag size={14} aria-hidden="true" />
              Réserver + ce produit
            </Link>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-full border border-border bg-primary-light px-4 py-2 text-sm font-medium text-primary">
            <ShoppingBag size={14} aria-hidden="true" />
            Disponible en salon
          </div>
        )}
      </div>
    </article>
  );
}
