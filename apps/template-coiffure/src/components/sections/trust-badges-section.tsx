import type { JSX } from 'react';
import { Star, Award, Users, CreditCard } from 'lucide-react';
import { StatItem } from '@/components/ui/stat-item';
import { salonConfig } from '@/config/salon.config';

/**
 * Barre de réassurance — carte blanche flottante entre Hero et Services.
 * 4 stats avec icônes dans cercles primary-light + séparateurs verticaux.
 *
 * TODO : les stats (rating, reviewCount, yearsOpen) peuvent venir de l'API Google Business
 */
export function TrustBadgesSection(): JSX.Element {
  const { stats } = salonConfig;

  return (
    <section
      className="relative z-10 -mt-10 mx-auto max-w-5xl px-6 lg:px-8"
      aria-label="Nos engagements"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_4px_20px_0_rgba(0,0,0,0.05)]">
        <div className="flex flex-col divide-y divide-border/50 sm:flex-row sm:divide-x sm:divide-y-0 px-6 sm:py-8">
          {/* Note Google */}
          <StatItem
            icon={
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(stats.rating)
                        ? 'fill-secondary text-secondary'
                        : 'fill-secondary/40 text-secondary/40'
                    }
                    aria-hidden="true"
                  />
                ))}
              </span>
            }
            value={`${stats.rating}/5`}
            label={`${stats.reviewCount} avis Google`}
          />

          {/* Expertise */}
          <StatItem
            icon={<Award size={18} aria-hidden="true" />}
            value="Expertise"
            label={`Ouvert depuis ${stats.yearsOpen} ans`}
            withDivider
          />

          {/* Spécialité */}
          <StatItem
            icon={<Users size={18} aria-hidden="true" />}
            value="Spécialistes"
            label={stats.speciality}
            withDivider
          />

          {/* Réservation */}
          <StatItem
            icon={<CreditCard size={18} aria-hidden="true" />}
            value="Réservation"
            label="Paiement sécurisé"
            withDivider
          />
        </div>
      </div>
    </section>
  );
}
