import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Mentions légales du site MARRYNOV – informations sur l'éditeur, l'hébergement, la propriété intellectuelle et le droit applicable.",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary-light py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-dark text-3xl font-bold md:text-4xl">Mentions Légales</h1>
            <p className="text-muted mt-3 text-sm">Dernière mise à jour : février 2026</p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose-custom space-y-10">
              {/* Éditeur */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">1. Éditeur du site</h2>
                <div className="bg-bg-light space-y-2 rounded-xl p-6 text-sm">
                  <p>
                    <span className="text-muted font-medium">Raison sociale :</span>{" "}
                    <span className="text-dark font-semibold">MARRYNOV</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Forme juridique :</span>{" "}
                    <span className="text-dark">Entreprise Individuelle (EI)</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">
                      Responsable de publication :
                    </span>{" "}
                    <span className="text-dark">Nicolas MARRY</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Adresse :</span>{" "}
                    <span className="text-dark">Saint-Denis, La Réunion (974)</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Téléphone :</span>{" "}
                    <a href="tel:+262692400066" className="text-primary hover:underline">
                      +262 692 40 00 66
                    </a>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Email :</span>{" "}
                    <a
                      href="mailto:contact@marrynov.re"
                      className="text-primary hover:underline"
                    >
                      contact@marrynov.re
                    </a>
                  </p>
                  <p>
                    <span className="text-muted font-medium">SIRET :</span>{" "}
                    <span className="text-dark">123 456 789 00012</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Code APE :</span>{" "}
                    <span className="text-dark">6201Z – Programmation informatique</span>
                  </p>
                </div>
              </div>

              {/* Hébergement */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">2. Hébergement</h2>
                <div className="bg-bg-light space-y-2 rounded-xl p-6 text-sm">
                  <p>
                    <span className="text-muted font-medium">Hébergeur :</span>{" "}
                    <span className="text-dark font-semibold">Vercel Inc.</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Adresse :</span>{" "}
                    <span className="text-dark">
                      340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis
                    </span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Site web :</span>{" "}
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      vercel.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Propriété intellectuelle */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  3. Propriété intellectuelle
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  L'ensemble du contenu de ce site (textes, images, graphismes, logo,
                  icônes, sons, logiciels…) est la propriété exclusive de MARRYNOV, à
                  l'exception des marques, logos ou contenus appartenant à d'autres
                  sociétés partenaires ou auteurs.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  Toute reproduction, distribution, modification, adaptation,
                  retransmission ou publication, même partielle, de ces différents
                  éléments est strictement interdite sans l'accord exprès par écrit de
                  MARRYNOV. Cette représentation ou reproduction, par quelque procédé que
                  ce soit, constitue une contrefaçon sanctionnée par les articles L.335-2
                  et suivants du Code de la propriété intellectuelle.
                </p>
              </div>

              {/* Liens hypertextes */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">4. Liens hypertextes</h2>
                <p className="text-body text-sm leading-relaxed">
                  Le site <strong>marrynov.re</strong> peut contenir des liens vers
                  d'autres sites internet. MARRYNOV n'exerce aucun contrôle sur ces sites
                  et décline toute responsabilité quant à leur contenu ou leur politique
                  de confidentialité.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  Tout lien hypertexte pointant vers le site marrynov.re doit faire
                  l'objet d'une autorisation préalable écrite de MARRYNOV.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">5. Cookies</h2>
                <p className="text-body text-sm leading-relaxed">
                  Ce site utilise uniquement des cookies techniques strictement
                  nécessaires à son bon fonctionnement (session, préférences de
                  navigation). Aucun cookie publicitaire ou de traçage tiers n'est déposé
                  sans votre consentement explicite.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  Conformément à la délibération CNIL n° 2013-378 et aux lignes
                  directrices en vigueur, ces cookies techniques ne nécessitent pas de
                  recueil de consentement préalable.
                </p>
              </div>

              {/* Responsabilité */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  6. Limitation de responsabilité
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  MARRYNOV s'efforce d'assurer l'exactitude et la mise à jour des
                  informations publiées sur ce site, dont elle se réserve le droit de
                  corriger le contenu à tout moment et sans préavis. Toutefois, MARRYNOV
                  ne peut garantir l'exactitude, la précision ou l'exhaustivité des
                  informations mises à disposition sur ce site.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  En conséquence, MARRYNOV décline toute responsabilité pour toute
                  imprécision, inexactitude ou omission portant sur des informations
                  disponibles sur ce site, ainsi que pour tous dommages résultant d'une
                  intrusion frauduleuse d'un tiers ayant entraîné une modification des
                  informations mises à disposition sur le site.
                </p>
              </div>

              {/* Droit applicable */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  7. Droit applicable et juridiction
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  Les présentes mentions légales sont soumises au droit français. En cas
                  de litige et à défaut de résolution amiable, les tribunaux français
                  seront seuls compétents.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  Ce site a été conçu conformément à la loi n° 2004-575 du 21 juin 2004
                  pour la confiance dans l'économie numérique (LCEN) et au Règlement
                  Général sur la Protection des Données (RGPD – UE 2016/679).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
