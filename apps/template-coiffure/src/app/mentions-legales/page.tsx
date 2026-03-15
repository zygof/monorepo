import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { salonConfig } from '@/config/salon.config';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Mentions Légales — ${salonConfig.name}`,
  description: `Mentions légales du site ${salonConfig.name}. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation du site.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/mentions-legales`,
  },
  robots: { index: true, follow: true },
};

/* ── Styles ─────────────────────────────────────────────────────────────── */

const SECTION_CLS = 'mb-10';
const H2_CLS = 'mb-4 font-serif text-2xl font-bold text-text';
const P_CLS = 'mb-3 text-base leading-relaxed text-text-subtle';
const UL_CLS = 'mb-3 list-disc pl-6 text-base leading-relaxed text-text-subtle space-y-1';

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function MentionsLegalesPage(): JSX.Element {
  const { name, contact, legal, seo } = salonConfig;

  return (
    <>
      <Header />

      <main id="main-content">
        <div className="mx-auto max-w-3xl px-6 lg:px-14">
          {/* Breadcrumb */}
          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-1.5 pt-28 pb-6 text-sm text-text-muted"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Accueil
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-text font-medium" aria-current="page">
              Mentions Légales
            </span>
          </nav>

          <h1 className="mb-12 font-serif text-4xl font-bold text-text lg:text-5xl">
            Mentions Légales
          </h1>

          <div className="pb-20">
            {/* ── 1. Éditeur du site ─────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>1. Éditeur du site</h2>
              <p className={P_CLS}>
                Le site <strong>{seo.siteUrl.replace('https://', '')}</strong> est édité par :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Raison sociale :</strong> {name}
                </li>
                <li>
                  <strong>Forme juridique :</strong> {legal.legalForm}
                </li>
                <li>
                  <strong>Responsable :</strong> {legal.ownerName}
                </li>
                <li>
                  <strong>SIRET :</strong> {legal.siret}
                </li>
                {legal.tvaNumber && (
                  <li>
                    <strong>TVA intracommunautaire :</strong> {legal.tvaNumber}
                  </li>
                )}
                <li>
                  <strong>Adresse :</strong> {contact.address}, {contact.postalCode} {contact.city},{' '}
                  {contact.region}
                </li>
                <li>
                  <strong>Téléphone :</strong>{' '}
                  <a href={`tel:${contact.phoneRaw}`} className="text-primary hover:underline">
                    {contact.phone}
                  </a>
                </li>
                {contact.email && (
                  <li>
                    <strong>Email :</strong>{' '}
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            </section>

            {/* ── 2. Directeur de la publication ────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>2. Directeur de la publication</h2>
              <p className={P_CLS}>
                Le directeur de la publication est <strong>{legal.ownerName}</strong>, en qualité de
                gérant(e) de {name}.
              </p>
            </section>

            {/* ── 3. Hébergement ────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>3. Hébergement</h2>
              <p className={P_CLS}>Le site est hébergé par :</p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Hébergeur :</strong> {legal.hostName}
                </li>
                <li>
                  <strong>Adresse :</strong> {legal.hostAddress}
                </li>
                <li>
                  <strong>Contact :</strong>{' '}
                  <a
                    href={legal.hostContact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {legal.hostContact}
                  </a>
                </li>
              </ul>
            </section>

            {/* ── 4. Propriété intellectuelle ───────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>4. Propriété intellectuelle</h2>
              <p className={P_CLS}>
                L&apos;ensemble du contenu du site (textes, images, photographies, logos, vidéos,
                éléments graphiques et sonores) est la propriété exclusive de {name} ou de ses
                partenaires et est protégé par les lois françaises et internationales relatives à la
                propriété intellectuelle.
              </p>
              <p className={P_CLS}>
                Toute reproduction, représentation, modification, publication ou adaptation de tout
                ou partie du contenu du site, quel que soit le moyen ou le procédé utilisé, est
                interdite sans l&apos;autorisation écrite préalable de {name}.
              </p>
            </section>

            {/* ── 5. Données personnelles ──────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>5. Protection des données personnelles</h2>
              <p className={P_CLS}>
                Les informations relatives au traitement de vos données personnelles sont détaillées
                dans notre{' '}
                <Link href="/confidentialite" className="text-primary hover:underline font-medium">
                  Politique de Confidentialité
                </Link>
                .
              </p>
              <p className={P_CLS}>
                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d&apos;un
                droit d&apos;accès, de rectification, de suppression et de portabilité de vos
                données. Vous pouvez exercer ces droits directement depuis votre{' '}
                <Link href="/compte" className="text-primary hover:underline font-medium">
                  espace client
                </Link>{' '}
                (export de données, suppression de compte) ou en nous contactant à l&apos;adresse{' '}
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                    {contact.email}
                  </a>
                ) : (
                  'indiquée ci-dessus'
                )}
                .
              </p>
            </section>

            {/* ── 6. Cookies ───────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>6. Cookies</h2>
              <p className={P_CLS}>
                Le site utilise des cookies strictement nécessaires au fonctionnement du service
                (session, préférences de consentement) qui ne nécessitent pas votre accord
                préalable.
              </p>
              <p className={P_CLS}>
                Des cookies de mesure d&apos;audience (Google Analytics 4 via Google Tag Manager)
                peuvent être déposés <strong>uniquement après votre consentement explicite</strong>,
                recueilli via un bandeau conforme aux recommandations de la CNIL (Consent Mode v2).
                Aucune donnée n&apos;est collectée tant que vous n&apos;avez pas accepté.
              </p>
              <p className={P_CLS}>
                Vous pouvez modifier vos choix à tout moment via le bandeau de consentement. Pour
                plus de détails, consultez notre{' '}
                <Link href="/confidentialite" className="text-primary hover:underline font-medium">
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </section>

            {/* ── 7. Responsabilité ────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>7. Limitation de responsabilité</h2>
              <p className={P_CLS}>
                {name} s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées
                sur ce site. Toutefois, {name} ne peut garantir l&apos;exactitude, la complétude ou
                l&apos;actualité des informations publiées et se réserve le droit de modifier le
                contenu à tout moment sans préavis.
              </p>
              <p className={P_CLS}>
                {name} ne saurait être tenu responsable de tout dommage direct ou indirect résultant
                de l&apos;accès ou de l&apos;utilisation du site, y compris l&apos;inaccessibilité,
                les pertes de données, les détériorations ou les virus qui pourraient affecter
                l&apos;équipement informatique de l&apos;utilisateur.
              </p>
            </section>

            {/* ── 8. Liens externes ────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>8. Liens hypertextes</h2>
              <p className={P_CLS}>
                Le site peut contenir des liens vers des sites tiers. {name} n&apos;exerce aucun
                contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leurs
                pratiques en matière de confidentialité ou leur disponibilité.
              </p>
            </section>

            {/* ── 9. Droit applicable ──────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>9. Droit applicable et juridiction</h2>
              <p className={P_CLS}>
                Les présentes mentions légales sont régies par le droit français. Tout litige
                relatif à l&apos;utilisation du site sera soumis à la compétence exclusive des
                tribunaux de {contact.city}, sauf disposition légale contraire.
              </p>
            </section>

            {/* ── 10. Crédits ──────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>10. Crédits</h2>
              <ul className={UL_CLS}>
                <li>
                  <strong>Conception et développement :</strong>{' '}
                  <a
                    href="https://marrynov.re"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    MARRYNOV
                  </a>
                </li>
                <li>
                  <strong>Photographies :</strong> {name} et banques d&apos;images libres de droits
                </li>
              </ul>
            </section>

            <hr className="border-border" />

            {/* Date de mise à jour */}
            <p className="mt-6 text-sm text-text-muted">
              Dernière mise à jour : {legal.lastUpdated}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
