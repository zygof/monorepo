import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { salonConfig } from '@/config/salon.config';

/* ── Metadata SEO ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `Politique de Confidentialité — ${salonConfig.name}`,
  description: `Politique de confidentialité et protection des données personnelles du salon ${salonConfig.name}. Vos droits RGPD et notre engagement pour la sécurité de vos données.`,
  alternates: {
    canonical: `${salonConfig.seo.siteUrl}/confidentialite`,
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

export default function ConfidentialitePage(): JSX.Element {
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
              Politique de Confidentialité
            </span>
          </nav>

          <h1 className="mb-12 font-serif text-4xl font-bold text-text lg:text-5xl">
            Politique de Confidentialité
          </h1>

          <div className="pb-20">
            {/* ── Introduction ──────────────────────────────── */}
            <section className={SECTION_CLS}>
              <p className={P_CLS}>
                <strong>{name}</strong> ({legal.legalForm}, SIRET {legal.siret}) s&apos;engage à
                protéger la vie privée de ses clients et utilisateurs. La présente politique de
                confidentialité décrit comment nous collectons, utilisons et protégeons vos données
                personnelles conformément au Règlement Général sur la Protection des Données (RGPD)
                et à la loi Informatique et Libertés.
              </p>
            </section>

            {/* ── 1. Responsable du traitement ──────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>1. Responsable du traitement</h2>
              <p className={P_CLS}>Le responsable du traitement des données personnelles est :</p>
              <ul className={UL_CLS}>
                <li>
                  <strong>{name}</strong> — {legal.ownerName}
                </li>
                <li>
                  {contact.address}, {contact.postalCode} {contact.city}, {contact.region}
                </li>
                {contact.email && (
                  <li>
                    Email :{' '}
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                      {contact.email}
                    </a>
                  </li>
                )}
                <li>
                  Téléphone :{' '}
                  <a href={`tel:${contact.phoneRaw}`} className="text-primary hover:underline">
                    {contact.phone}
                  </a>
                </li>
              </ul>
            </section>

            {/* ── 2. Données collectées ─────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>2. Données personnelles collectées</h2>
              <p className={P_CLS}>
                Nous collectons les données suivantes dans le cadre de nos services :
              </p>

              <h3 className={H3_CLS}>2.1 Lors de la réservation en ligne</h3>
              <ul className={UL_CLS}>
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Prestations choisies, date et heure souhaitées</li>
                <li>Notes ou demandes particulières (optionnel)</li>
                <li>Préférence de notification SMS</li>
              </ul>

              <h3 className={H3_CLS}>2.2 Lors de l&apos;utilisation du formulaire de contact</h3>
              <ul className={UL_CLS}>
                <li>Nom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Objet et contenu du message</li>
              </ul>

              <h3 className={H3_CLS}>2.3 Lors de la création d&apos;un compte client</h3>
              <ul className={UL_CLS}>
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Mot de passe (stocké sous forme chiffrée)</li>
              </ul>

              <h3 className={H3_CLS}>2.4 Données de navigation</h3>
              <ul className={UL_CLS}>
                <li>Adresse IP (anonymisée)</li>
                <li>Type de navigateur et système d&apos;exploitation</li>
                <li>Pages visitées et durée de visite</li>
              </ul>
            </section>

            {/* ── 3. Finalités ──────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>3. Finalités du traitement</h2>
              <p className={P_CLS}>Vos données sont utilisées exclusivement pour :</p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Gestion des rendez-vous :</strong> confirmation, rappels, suivi
                </li>
                <li>
                  <strong>Communication client :</strong> réponse à vos demandes via le formulaire
                  de contact
                </li>
                <li>
                  <strong>Gestion du compte client :</strong> authentification, historique des
                  rendez-vous
                </li>
                <li>
                  <strong>Amélioration du service :</strong> statistiques anonymisées de
                  fréquentation du site
                </li>
                <li>
                  <strong>Obligations légales :</strong> facturation, comptabilité
                </li>
              </ul>
              <p className={P_CLS}>
                Vos données ne sont <strong>jamais vendues</strong> à des tiers et ne sont{' '}
                <strong>jamais utilisées à des fins publicitaires</strong> sans votre consentement
                explicite.
              </p>
            </section>

            {/* ── 4. Base légale ────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>4. Base légale du traitement</h2>
              <p className={P_CLS}>
                Le traitement de vos données repose sur les bases légales suivantes :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Exécution du contrat :</strong> traitement nécessaire à la gestion de
                  votre réservation et à la réalisation des prestations (article 6.1.b du RGPD)
                </li>
                <li>
                  <strong>Consentement :</strong> pour l&apos;envoi de notifications SMS et
                  d&apos;éventuelles communications marketing (article 6.1.a du RGPD)
                </li>
                <li>
                  <strong>Intérêt légitime :</strong> amélioration de nos services et sécurité du
                  site (article 6.1.f du RGPD)
                </li>
                <li>
                  <strong>Obligation légale :</strong> conservation des données de facturation
                  (article 6.1.c du RGPD)
                </li>
              </ul>
            </section>

            {/* ── 5. Durée de conservation ─────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>5. Durée de conservation</h2>
              <p className={P_CLS}>
                Vos données sont conservées pour la durée strictement nécessaire aux finalités pour
                lesquelles elles ont été collectées :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Données de réservation :</strong> 3 ans après le dernier rendez-vous
                </li>
                <li>
                  <strong>Données de contact (formulaire) :</strong> 1 an après la dernière
                  interaction
                </li>
                <li>
                  <strong>Données de compte client :</strong> durée de vie du compte + 3 ans après
                  suppression
                </li>
                <li>
                  <strong>Données de facturation :</strong> 10 ans (obligation comptable légale)
                </li>
                <li>
                  <strong>Données de navigation :</strong> 13 mois maximum (conformément aux
                  recommandations CNIL)
                </li>
              </ul>
            </section>

            {/* ── 6. Destinataires ─────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>6. Destinataires des données</h2>
              <p className={P_CLS}>
                Vos données peuvent être communiquées aux destinataires suivants, dans la stricte
                limite de ce qui est nécessaire :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Personnel du salon :</strong> stylistes et personnel d&apos;accueil
                  (gestion des rendez-vous)
                </li>
                <li>
                  <strong>Sous-traitants techniques :</strong> hébergeur web ({legal.hostName}),
                  service d&apos;envoi d&apos;emails transactionnels
                </li>
                <li>
                  <strong>Prestataire de paiement :</strong> traitement sécurisé des paiements par
                  carte bancaire (les données bancaires ne sont jamais stockées sur nos serveurs)
                </li>
              </ul>
              <p className={P_CLS}>
                Tous nos sous-traitants sont liés par des clauses contractuelles garantissant la
                confidentialité et la sécurité de vos données. Aucun transfert de données hors de
                l&apos;Union Européenne n&apos;est effectué sans garanties appropriées.
              </p>
            </section>

            {/* ── 7. Sécurité ──────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>7. Sécurité des données</h2>
              <p className={P_CLS}>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
                protéger vos données :
              </p>
              <ul className={UL_CLS}>
                <li>Chiffrement SSL/TLS de toutes les communications (HTTPS)</li>
                <li>Mots de passe stockés sous forme de hash sécurisé (jamais en clair)</li>
                <li>Accès aux données limité au personnel autorisé</li>
                <li>Sauvegardes régulières et chiffrées</li>
                <li>Mises à jour de sécurité appliquées régulièrement</li>
              </ul>
            </section>

            {/* ── 8. Cookies ───────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>8. Cookies</h2>

              <h3 className={H3_CLS}>8.1 Cookies strictement nécessaires</h3>
              <p className={P_CLS}>
                Ces cookies sont indispensables au fonctionnement du site et ne nécessitent pas
                votre consentement (article 82 de la loi Informatique et Libertés) :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Cookie de session :</strong> maintien de votre connexion pendant la
                  navigation (expire à la fermeture du navigateur)
                </li>
                <li>
                  <strong>Préférences de consentement :</strong> mémorisation de vos choix
                  concernant les cookies (durée : 1 an)
                </li>
              </ul>

              <h3 className={H3_CLS}>8.2 Cookies de mesure d&apos;audience</h3>
              <p className={P_CLS}>
                Sous réserve de votre consentement explicite, nous utilisons Google Analytics 4 (via
                Google Tag Manager) pour mesurer la fréquentation de notre site et améliorer nos
                services. Ces cookies collectent des données anonymisées :
              </p>
              <ul className={UL_CLS}>
                <li>Pages visitées, durée de session, parcours de navigation</li>
                <li>Type d&apos;appareil, navigateur, zone géographique approximative</li>
              </ul>
              <p className={P_CLS}>
                Conformément au mode Consent v2 de Google,{' '}
                <strong>aucune donnée n&apos;est collectée avant votre acceptation</strong>. Vous
                pouvez modifier votre choix à tout moment via le bandeau de consentement accessible
                en bas de page.
              </p>
              <p className={P_CLS}>
                Les données collectées sont hébergées par Google dans l&apos;Union Européenne et
                conservées pendant 14 mois maximum, conformément aux recommandations de la CNIL.
              </p>
            </section>

            {/* ── 9. Droits ────────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>9. Vos droits</h2>
              <p className={P_CLS}>
                Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
                suivants sur vos données personnelles :
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Droit d&apos;accès :</strong> obtenir la confirmation du traitement et une
                  copie de vos données
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger des données inexactes ou
                  incomplètes
                </li>
                <li>
                  <strong>Droit d&apos;effacement :</strong> demander la suppression de vos données
                  (« droit à l&apos;oubli »)
                </li>
                <li>
                  <strong>Droit à la limitation :</strong> restreindre le traitement dans certains
                  cas
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> recevoir vos données dans un format
                  structuré et lisible
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au traitement pour des
                  motifs légitimes
                </li>
                <li>
                  <strong>Droit de retirer votre consentement :</strong> à tout moment, sans
                  affecter la licéité du traitement antérieur
                </li>
              </ul>
              <p className={P_CLS}>
                <strong>Exercez vos droits directement en ligne :</strong>
              </p>
              <ul className={UL_CLS}>
                <li>
                  <strong>Portabilité :</strong> depuis votre{' '}
                  <Link href="/compte" className="text-primary hover:underline font-medium">
                    espace client
                  </Link>
                  , cliquez sur « Exporter mes données » pour télécharger l&apos;ensemble de vos
                  données au format JSON
                </li>
                <li>
                  <strong>Effacement :</strong> depuis votre espace client, cliquez sur « Supprimer
                  mon compte ». Vos données seront anonymisées et un email de confirmation vous sera
                  envoyé
                </li>
                <li>
                  <strong>Rectification :</strong> modifiez directement vos informations depuis
                  l&apos;onglet « Profil » de votre espace client
                </li>
              </ul>
              <p className={P_CLS}>Vous pouvez également nous contacter :</p>
              <ul className={UL_CLS}>
                {contact.email && (
                  <li>
                    Par email :{' '}
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                      {contact.email}
                    </a>
                  </li>
                )}
                <li>
                  Par courrier : {name}, {contact.address}, {contact.postalCode} {contact.city}
                </li>
              </ul>
              <p className={P_CLS}>
                Nous nous engageons à répondre dans un délai d&apos;un mois. Si vous estimez que vos
                droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la{' '}
                <a
                  href="https://www.cnil.fr/fr/plaintes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CNIL
                </a>{' '}
                (Commission Nationale de l&apos;Informatique et des Libertés).
              </p>
            </section>

            {/* ── 10. Mineurs ──────────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>10. Protection des mineurs</h2>
              <p className={P_CLS}>
                Notre site ne s&apos;adresse pas spécifiquement aux mineurs de moins de 16 ans. La
                réservation en ligne et la création de compte sont réservées aux personnes majeures
                ou disposant de l&apos;autorisation d&apos;un représentant légal.
              </p>
            </section>

            {/* ── 11. Modifications ────────────────────────── */}
            <section className={SECTION_CLS}>
              <h2 className={H2_CLS}>11. Modifications de cette politique</h2>
              <p className={P_CLS}>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout
                moment. Les modifications entrent en vigueur dès leur publication sur cette page. La
                date de dernière mise à jour est indiquée ci-dessous.
              </p>
              <p className={P_CLS}>
                En cas de modification substantielle, nous vous en informerons par email ou par une
                notification visible sur le site.
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
