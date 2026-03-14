import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { salonConfig } from '@/config/salon.config';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Conditions Générales de Vente — ${salonConfig.name}`,
  description: `Conditions générales de vente du salon ${salonConfig.name}. Tarifs, réservation, annulation, paiement et responsabilité.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/cgv`,
  },
  robots: { index: true, follow: true },
};

/* ── Styles ─────────────────────────────────────────────────────────────── */

const SECTION_CLS = 'mb-10';
const H2_CLS = 'mb-4 font-serif text-2xl font-bold text-text';
const H3_CLS = 'mb-2 mt-6 font-serif text-lg font-bold text-text';
const P_CLS = 'mb-3 text-base leading-relaxed text-text-subtle';
const UL_CLS = 'mb-3 list-disc pl-6 text-base leading-relaxed text-text-subtle space-y-1';

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function CgvPage(): JSX.Element {
  const { name, contact, legal } = salonConfig;

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
              Conditions Générales de Vente
            </span>
          </nav>

          <h1 className="mb-12 font-serif text-4xl font-bold text-text lg:text-5xl">
            Conditions Générales de Vente
          </h1>

          <div className="pb-20">
            {/* ── 1. Objet ──────────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>1. Objet</h2>
              <p className={P_CLS}>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations
                contractuelles entre <strong>{name}</strong> ({legal.legalForm}, SIRET {legal.siret}
                ), ci-après « le Salon », et toute personne effectuant une réservation ou un achat
                de prestations de coiffure, ci-après « le Client ».
              </p>
              <p className={P_CLS}>
                En réservant un rendez-vous ou en bénéficiant de nos services, le Client reconnaît
                avoir pris connaissance des présentes CGV et les accepter sans réserve.
              </p>
            </section>

            {/* ── 2. Prestations ────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>2. Prestations et tarifs</h2>
              <p className={P_CLS}>
                Les prestations proposées par le Salon sont détaillées sur la page{' '}
                <Link href="/services" className="text-primary hover:underline font-medium">
                  Services
                </Link>
                . Les tarifs indiqués sont en euros TTC et constituent des prix de départ pouvant
                varier en fonction de la longueur, de l&apos;épaisseur et de la texture des cheveux.
              </p>
              <p className={P_CLS}>
                Le Salon se réserve le droit de modifier ses tarifs à tout moment. Les prestations
                seront facturées sur la base des tarifs en vigueur au moment de la réalisation du
                service.
              </p>
              <p className={P_CLS}>
                Un devis personnalisé peut être établi sur demande pour les prestations complexes
                (mariage, extensions, couleur technique). Ce devis, une fois accepté par le Client,
                vaut engagement ferme.
              </p>
            </section>

            {/* ── 3. Réservation ────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>3. Réservation et rendez-vous</h2>

              <h3 className={H3_CLS}>3.1 Prise de rendez-vous</h3>
              <p className={P_CLS}>
                Les rendez-vous peuvent être pris en ligne via notre site, par téléphone au{' '}
                <a href={`tel:${contact.phoneRaw}`} className="text-primary hover:underline">
                  {contact.phone}
                </a>
                {contact.whatsapp && ', par WhatsApp'} ou directement au salon.
              </p>
              <p className={P_CLS}>
                La confirmation de rendez-vous vaut acceptation des présentes CGV. Un rappel peut
                être envoyé par SMS ou email 24 heures avant le rendez-vous si le Client a donné son
                accord.
              </p>

              <h3 className={H3_CLS}>3.2 Annulation et modification</h3>
              <p className={P_CLS}>
                Toute annulation ou modification doit être effectuée au minimum{' '}
                <strong>24 heures avant le rendez-vous</strong>. Au-delà de ce délai, le Salon se
                réserve le droit de facturer un montant forfaitaire correspondant à 50 % du prix de
                la prestation prévue.
              </p>
              <p className={P_CLS}>
                En cas de retard supérieur à <strong>15 minutes</strong>, le Salon se réserve le
                droit de reporter ou d&apos;annuler le rendez-vous sans dédommagement. Si le temps
                restant le permet, la prestation pourra être adaptée.
              </p>

              <h3 className={H3_CLS}>3.3 Absence sans prévenir (no-show)</h3>
              <p className={P_CLS}>
                En cas d&apos;absence non signalée, la totalité de la prestation pourra être
                facturée. Après deux absences non signalées, le Salon se réserve le droit de refuser
                toute nouvelle réservation en ligne et d&apos;exiger un acompte pour les rendez-vous
                futurs.
              </p>
            </section>

            {/* ── 4. Paiement ──────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>4. Modalités de paiement</h2>
              <p className={P_CLS}>
                Le paiement des prestations est exigible à la fin du service. Les moyens de paiement
                acceptés sont :
              </p>
              <ul className={UL_CLS}>
                <li>Carte bancaire (CB, Visa, Mastercard)</li>
                <li>Espèces</li>
                <li>Virement bancaire (sur demande, pour les forfaits mariage uniquement)</li>
              </ul>
              <p className={P_CLS}>
                Pour les prestations mariage et événements spéciaux, un acompte de{' '}
                <strong>30 %</strong> du montant total est demandé à la confirmation. Cet acompte
                n&apos;est pas remboursable en cas d&apos;annulation à moins de 30 jours de
                l&apos;événement.
              </p>
            </section>

            {/* ── 5. Droit de rétractation ─────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>5. Droit de rétractation</h2>
              <p className={P_CLS}>
                Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de
                rétractation ne s&apos;applique pas aux prestations de services de coiffure
                pleinement exécutées avant la fin du délai de rétractation et dont l&apos;exécution
                a commencé avec l&apos;accord du consommateur.
              </p>
              <p className={P_CLS}>
                Pour les produits capillaires achetés en salon ou en ligne (si applicable), le
                Client dispose d&apos;un délai de <strong>14 jours</strong> à compter de la
                réception pour exercer son droit de rétractation, sous réserve que le produit soit
                retourné dans son emballage d&apos;origine, non ouvert et non utilisé.
              </p>
            </section>

            {/* ── 6. Réclamations ──────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>6. Satisfaction et réclamations</h2>
              <p className={P_CLS}>
                La satisfaction de nos clients est notre priorité. En cas d&apos;insatisfaction
                concernant une prestation, nous vous invitons à nous contacter dans un délai de{' '}
                <strong>48 heures</strong> suivant la prestation afin que nous puissions trouver une
                solution adaptée (retouche gratuite, geste commercial).
              </p>
              <p className={P_CLS}>Toute réclamation peut être adressée :</p>
              <ul className={UL_CLS}>
                <li>
                  Par email à{' '}
                  {contact.email ? (
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                      {contact.email}
                    </a>
                  ) : (
                    'notre adresse de contact'
                  )}
                </li>
                <li>
                  Par téléphone au{' '}
                  <a href={`tel:${contact.phoneRaw}`} className="text-primary hover:underline">
                    {contact.phone}
                  </a>
                </li>
                <li>Directement au salon à l&apos;accueil</li>
              </ul>
            </section>

            {/* ── 7. Responsabilité ────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>7. Responsabilité</h2>
              <p className={P_CLS}>
                Le Salon s&apos;engage à réaliser les prestations avec le plus grand soin et
                professionnalisme. Il met en œuvre tous les moyens nécessaires pour assurer la
                sécurité et le bien-être de ses clients.
              </p>
              <p className={P_CLS}>
                Le Client s&apos;engage à signaler toute allergie connue, tout traitement capillaire
                récent ou toute condition médicale pouvant interférer avec les prestations. Le Salon
                décline toute responsabilité en cas d&apos;omission de ces informations par le
                Client.
              </p>
              <p className={P_CLS}>
                Le Salon ne saurait être tenu responsable des dommages résultant d&apos;une
                utilisation inappropriée des produits vendus ou de la non-observance des conseils
                d&apos;entretien prodigués.
              </p>
            </section>

            {/* ── 8. Objets personnels ─────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>8. Objets personnels</h2>
              <p className={P_CLS}>
                Le Salon met à disposition des espaces pour déposer les effets personnels mais
                décline toute responsabilité en cas de perte, vol ou détérioration des objets
                personnels laissés dans l&apos;établissement.
              </p>
            </section>

            {/* ── 9. Données personnelles ──────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>9. Protection des données</h2>
              <p className={P_CLS}>
                Les données personnelles collectées dans le cadre de la réservation et de la
                relation commerciale sont traitées conformément à notre{' '}
                <Link href="/confidentialite" className="text-primary hover:underline font-medium">
                  Politique de Confidentialité
                </Link>
                .
              </p>
            </section>

            {/* ── 10. Médiation ────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>10. Médiation des litiges</h2>
              <p className={P_CLS}>
                Conformément aux articles L.611-1 et suivants du Code de la consommation, en cas de
                litige non résolu, le Client peut recourir gratuitement au service de médiation de
                la consommation. Le médiateur compétent est :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Médiateur :</strong> Médiation de la consommation (à préciser lors de la
                  mise en production)
                </li>
                <li>
                  <strong>Site web :</strong> À compléter
                </li>
              </ul>
              <p className={P_CLS}>
                Le Client peut également déposer sa réclamation sur la plateforme européenne de
                règlement en ligne des litiges :{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
            </section>

            {/* ── 11. Droit applicable ─────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>11. Droit applicable</h2>
              <p className={P_CLS}>
                Les présentes CGV sont soumises au droit français. Tout litige sera de la compétence
                exclusive des tribunaux de {contact.city}, sauf disposition légale contraire.
              </p>
            </section>

            <hr className="border-border" />

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
