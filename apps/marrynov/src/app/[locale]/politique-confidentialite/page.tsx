import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité RGPD de MARRYNOV – comment vos données personnelles sont collectées, utilisées et protégées.",
  robots: { index: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary-light py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-dark text-3xl font-bold md:text-4xl">
              Politique de Confidentialité
            </h1>
            <p className="text-muted mt-3 text-sm">
              Dernière mise à jour : février 2026 — Conforme RGPD (UE 2016/679)
            </p>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-10">
              {/* Intro */}
              <div className="bg-bg-light rounded-xl p-6">
                <p className="text-body text-sm leading-relaxed">
                  MARRYNOV, entreprise individuelle représentée par Nicolas MARRY, attache
                  une importance particulière à la protection de vos données personnelles.
                  Cette politique vous informe de manière transparente sur la façon dont
                  nous collectons, utilisons et protégeons vos données, conformément au
                  Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et
                  à la loi Informatique et Libertés modifiée.
                </p>
              </div>

              {/* Responsable du traitement */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  1. Responsable du traitement
                </h2>
                <div className="bg-bg-light space-y-2 rounded-xl p-6 text-sm">
                  <p>
                    <span className="text-muted font-medium">Entité :</span>{" "}
                    <span className="text-dark font-semibold">MARRYNOV</span>{" "}
                    (Entrepreneur Individuel)
                  </p>
                  <p>
                    <span className="text-muted font-medium">
                      Directeur de publication :
                    </span>{" "}
                    <span className="text-dark">Nicolas MARRY</span>
                  </p>
                  <p>
                    <span className="text-muted font-medium">Adresse :</span>{" "}
                    <span className="text-dark">Saint-Denis, La Réunion (974)</span>
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
                    <span className="text-muted font-medium">Téléphone :</span>{" "}
                    <a href="tel:+262692400066" className="text-primary hover:underline">
                      +262 692 40 00 66
                    </a>
                  </p>
                </div>
              </div>

              {/* Données collectées */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  2. Données collectées
                </h2>
                <p className="text-body mb-4 text-sm leading-relaxed">
                  Nous collectons uniquement les données que vous nous transmettez
                  volontairement via notre formulaire de contact. La fourniture de
                  l'adresse e-mail est nécessaire pour répondre à votre demande ; les
                  autres champs sont facultatifs.
                </p>
                <div className="border-border overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-light">
                      <tr>
                        <th className="text-dark px-4 py-3 text-left font-semibold">
                          Donnée
                        </th>
                        <th className="text-dark px-4 py-3 text-left font-semibold">
                          Caractère
                        </th>
                        <th className="text-dark px-4 py-3 text-left font-semibold">
                          Finalité
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {[
                        {
                          data: "Nom et prénom",
                          required: false,
                          purpose: "Personnaliser la réponse",
                        },
                        {
                          data: "Adresse e-mail",
                          required: true,
                          purpose: "Vous recontacter",
                        },
                        {
                          data: "Téléphone",
                          required: false,
                          purpose: "Contact téléphonique si souhaité",
                        },
                        {
                          data: "Budget estimé",
                          required: false,
                          purpose: "Adapter la proposition commerciale",
                        },
                        {
                          data: "Type de projet",
                          required: false,
                          purpose: "Qualifier votre besoin",
                        },
                        {
                          data: "Description du projet",
                          required: false,
                          purpose: "Comprendre votre besoin en détail",
                        },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-bg-light/50" : ""}>
                          <td className="text-body px-4 py-3">{row.data}</td>
                          <td className="px-4 py-3">
                            {row.required ? (
                              <span className="text-primary text-xs font-semibold">
                                Obligatoire
                              </span>
                            ) : (
                              <span className="text-muted text-xs">Facultatif</span>
                            )}
                          </td>
                          <td className="text-body px-4 py-3">{row.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Base légale */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  3. Base légale des traitements
                </h2>
                <p className="text-body mb-4 text-sm leading-relaxed">
                  Les traitements de vos données reposent sur la base légale de l'
                  <strong>intérêt légitime</strong> (article 6.1.f du RGPD) : répondre à
                  une demande de contact spontanée constitue un intérêt légitime justifié,
                  tel que reconnu par le considérant 47 du RGPD.
                </p>
                <p className="text-body text-sm leading-relaxed">
                  Vos données ne sont{" "}
                  <strong>
                    jamais utilisées à des fins de prospection commerciale non sollicitée
                  </strong>
                  . Si nous devions vous contacter à des fins de démarchage, une base
                  légale de consentement distinct et explicite serait recueillie au
                  préalable.
                </p>
              </div>

              {/* Durée de conservation */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  4. Durée de conservation
                </h2>
                <div className="border-border overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-light">
                      <tr>
                        <th className="text-dark px-4 py-3 text-left font-semibold">
                          Catégorie
                        </th>
                        <th className="text-dark px-4 py-3 text-left font-semibold">
                          Durée
                        </th>
                        <th className="text-dark px-4 py-3 text-left font-semibold">
                          Référence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      <tr>
                        <td className="text-body px-4 py-3">
                          Données formulaire (prospect non converti)
                        </td>
                        <td className="text-body px-4 py-3 font-medium">3 ans</td>
                        <td className="text-muted px-4 py-3 text-xs">
                          Recommandation CNIL
                        </td>
                      </tr>
                      <tr className="bg-bg-light/50">
                        <td className="text-body px-4 py-3">
                          Données client (relation commerciale)
                        </td>
                        <td className="text-body px-4 py-3 font-medium">
                          5 ans après fin de relation
                        </td>
                        <td className="text-muted px-4 py-3 text-xs">
                          Art. 2224 Code civil
                        </td>
                      </tr>
                      <tr>
                        <td className="text-body px-4 py-3">
                          Pièces comptables et contractuelles
                        </td>
                        <td className="text-body px-4 py-3 font-medium">10 ans</td>
                        <td className="text-muted px-4 py-3 text-xs">
                          Art. L.123-22 Code de commerce
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Destinataires & transferts */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  5. Destinataires et transferts
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  Vos données sont destinées exclusivement à{" "}
                  <strong>Nicolas MARRY (MARRYNOV)</strong>. Elles ne sont{" "}
                  <strong>ni vendues, ni cédées, ni louées</strong> à des tiers.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  Le site est hébergé par <strong>Vercel Inc.</strong> (340 Pine Street,
                  Suite 701, San Francisco, CA 94104, États-Unis), qui agit en tant que
                  sous-traitant. Ce transfert de données hors UE est encadré : Vercel est
                  certifié au cadre <strong>EU-US Data Privacy Framework</strong> depuis
                  juillet 2023, garantissant un niveau de protection adéquat reconnu par
                  la Commission européenne (décision du 10 juillet 2023).
                </p>
              </div>

              {/* Vos droits */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">6. Vos droits</h2>
                <p className="text-body mb-4 text-sm leading-relaxed">
                  Conformément aux articles 15 à 22 du RGPD, vous disposez des droits
                  suivants :
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    {
                      droit: "Droit d'accès (Art. 15)",
                      desc: "Obtenir une copie de vos données que nous détenons.",
                    },
                    {
                      droit: "Droit de rectification (Art. 16)",
                      desc: "Faire corriger des données inexactes ou incomplètes.",
                    },
                    {
                      droit: "Droit à l'effacement (Art. 17)",
                      desc: "Demander la suppression de vos données.",
                    },
                    {
                      droit: "Droit à la limitation (Art. 18)",
                      desc: "Suspendre temporairement l'utilisation de vos données.",
                    },
                    {
                      droit: "Droit à la portabilité (Art. 20)",
                      desc: "Recevoir vos données dans un format lisible par machine.",
                    },
                    {
                      droit: "Droit d'opposition (Art. 21)",
                      desc: "Vous opposer au traitement fondé sur l'intérêt légitime.",
                    },
                    {
                      droit: "Droit de réclamation (Art. 77)",
                      desc: "Saisir la CNIL si vous estimez que vos droits ne sont pas respectés.",
                    },
                  ].map((item) => (
                    <div key={item.droit} className="bg-bg-light rounded-lg p-4">
                      <p className="text-dark text-sm font-semibold">{item.droit}</p>
                      <p className="text-muted mt-1 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-primary/5 border-primary/20 mt-4 rounded-xl border p-4 text-sm">
                  <p className="text-body">
                    Pour exercer ces droits :{" "}
                    <a
                      href="mailto:contact@marrynov.re"
                      className="text-primary font-medium hover:underline"
                    >
                      contact@marrynov.re
                    </a>
                    . Réponse garantie sous <strong>30 jours</strong> (extensible à 3 mois
                    pour les demandes complexes — Art. 12.3 RGPD).
                  </p>
                  <p className="text-body mt-2">
                    En cas de litige non résolu, vous pouvez saisir la{" "}
                    <strong>CNIL</strong> :{" "}
                    <a
                      href="https://www.cnil.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      cnil.fr
                    </a>{" "}
                    — 3 Place de Fontenoy, 75007 Paris.
                  </p>
                </div>
              </div>

              {/* Sécurité */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  7. Sécurité des données
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  Nous mettons en œuvre les mesures techniques et organisationnelles
                  appropriées pour protéger vos données :
                </p>
                <ul className="text-body mt-3 space-y-2 text-sm">
                  {[
                    "Transmission chiffrée via HTTPS/TLS",
                    "Accès aux données limité au seul responsable du traitement",
                    "Hébergement sur infrastructure sécurisée certifiée (Vercel)",
                    "Aucun stockage de données de paiement sur notre site",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-primary font-bold">—</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Décision automatisée */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  8. Absence de décision automatisée
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  Vos données personnelles ne font l'objet d'aucune décision automatisée
                  ni d'aucun profilage au sens de l'article 22 du RGPD. Chaque demande est
                  traitée manuellement par Nicolas MARRY.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">9. Cookies</h2>
                <p className="text-body text-sm leading-relaxed">
                  Ce site utilise uniquement des{" "}
                  <strong>cookies techniques strictement nécessaires</strong> au
                  fonctionnement du site (gestion de session, préférences de navigation).
                  Ces cookies ne collectent aucune donnée à des fins publicitaires ou de
                  profilage.
                </p>
                <p className="text-body mt-3 text-sm leading-relaxed">
                  Conformément aux lignes directrices de la CNIL, aucun consentement
                  préalable n'est requis pour ces cookies techniques. Si des outils
                  d'analyse ou des cookies tiers étaient intégrés à l'avenir, un bandeau
                  de consentement conforme serait mis en place et cette politique mise à
                  jour.
                </p>
              </div>

              {/* Modifications */}
              <div>
                <h2 className="text-dark mb-4 text-xl font-bold">
                  10. Modifications de cette politique
                </h2>
                <p className="text-body text-sm leading-relaxed">
                  MARRYNOV se réserve le droit de modifier cette politique à tout moment
                  pour se conformer à toute évolution réglementaire ou à nos pratiques
                  internes. La date de dernière mise à jour est indiquée en haut de cette
                  page.
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
