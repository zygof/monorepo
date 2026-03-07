import React from "react";

// ---------------------------------------------------------------------------
// Shared prose sub-components
// ---------------------------------------------------------------------------

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-dark mt-10 mb-4 text-2xl font-bold">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-dark mt-8 mb-3 text-xl font-semibold">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body mb-4 leading-relaxed">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mb-6 space-y-2">{children}</ul>;
}

function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-body flex gap-3">
      <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
      <span>{children}</span>
    </li>
  );
}

function OL({ children }: { children: React.ReactNode }) {
  return <ol className="text-body mb-6 list-decimal space-y-3 pl-5">{children}</ol>;
}

function OLI({ children }: { children: React.ReactNode }) {
  return <li className="text-body leading-relaxed">{children}</li>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong className="text-dark font-semibold">{children}</strong>;
}

function Blockquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-primary bg-primary/5 text-body my-6 rounded-r-xl border-l-4 px-5 py-4 italic">
      {children}
    </blockquote>
  );
}

function InfoBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="border-primary/20 bg-primary/5 my-6 rounded-xl border p-5">
      {title && <p className="text-primary mb-2 font-semibold">{title}</p>}
      <div className="text-body">{children}</div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-accent/30 bg-accent/5 my-6 rounded-xl border p-5">
      <div className="text-body">{children}</div>
    </div>
  );
}

function TableResponsive({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="border-border my-6 overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-bg-light">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-dark px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-bg-light transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="text-body px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type FAQItem = { question: string; answer: string };

function FAQSection({ items }: { items: FAQItem[] }) {
  return (
    <div className="my-10">
      <H2>Questions fréquentes</H2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group border-border bg-bg-white overflow-hidden rounded-xl border"
          >
            <summary className="text-dark hover:bg-bg-light flex w-full cursor-pointer list-none items-center justify-between p-5 font-medium transition-colors">
              <span>{item.question}</span>
              <svg
                className="text-muted h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5">
              <p className="text-body leading-relaxed">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article 1 — Aide Kap Numérik 2026
// ---------------------------------------------------------------------------

function ArticleKapNumerik() {
  return (
    <div>
      <P>
        Vous êtes une entreprise réunionnaise et vous souhaitez créer votre site web,
        lancer une application mobile ou moderniser votre présence numérique ? Bonne
        nouvelle : la Région Réunion finance une grande partie de cette transition via le
        dispositif <B>Kap Numérik</B>. Jusqu'à <B>3 200 €</B> peuvent être déduits
        directement de votre facture. Ce guide vous explique tout ce que vous devez savoir
        pour en bénéficier en 2026.
      </P>

      <H2>Qu'est-ce que Kap Numérik ?</H2>
      <P>
        Kap Numérik est un dispositif d'aide à la transition numérique lancé par la Région
        Réunion. Son objectif est simple : aider les TPE et PME réunionnaises à se
        digitaliser en subventionnant les prestations réalisées par des prestataires
        locaux agréés.
      </P>
      <P>
        Concrètement, si vous faites appel à un prestataire agréé pour créer votre site
        web ou votre application, vous ne payez qu'une partie du montant.{" "}
        <B>L'aide est directement déduite de votre facture</B> — vous n'avez pas à avancer
        la somme puis à vous faire rembourser.
      </P>

      <InfoBox title="💡 Exemple concret">
        <p>
          Un site vitrine à 2 500 € HT chez un prestataire Kap Numérik peut vous revenir à{" "}
          <B>moins de 500 €</B> après déduction de l'aide maximale de 3 200 €. Pour un
          artisan ou un commerçant réunionnais, c'est une opportunité rare à ne pas
          manquer.
        </p>
      </InfoBox>

      <H3>Qui peut bénéficier de Kap Numérik ?</H3>
      <UL>
        <LI>TPE et PME ayant leur siège social à La Réunion</LI>
        <LI>Auto-entrepreneurs, artisans, commerçants et professions libérales</LI>
        <LI>Associations à activité économique</LI>
        <LI>Entreprises enregistrées au RCS ou au répertoire des métiers</LI>
      </UL>
      <P>
        En revanche, les entreprises publiques, établissements scolaires et organismes
        institutionnels ne sont pas éligibles. Si vous avez un doute, votre prestataire
        Kap Numérik peut vous aider à vérifier votre situation.
      </P>

      <H3>Quels types de prestations sont couverts ?</H3>
      <UL>
        <LI>Création de site web vitrine</LI>
        <LI>Développement d'un site e-commerce</LI>
        <LI>Création d'une application mobile (iOS et/ou Android)</LI>
        <LI>Refonte complète d'un site existant</LI>
        <LI>Mise en place d'une solution de vente en ligne</LI>
        <LI>Développement d'un logiciel ou application métier sur-mesure</LI>
      </UL>

      <H2>Comment obtenir l'aide Kap Numérik en 2026 ?</H2>
      <P>
        La démarche est plus simple qu'il n'y paraît. Voici les étapes à suivre, dans
        l'ordre.
      </P>

      <H3>Étape 1 — Vérifier votre éligibilité</H3>
      <P>
        Avant tout, confirmez que votre entreprise est bien éligible : être une TPE/PME
        réunionnaise, à jour de vos cotisations sociales et fiscales. Votre prestataire
        Kap Numérik peut effectuer cette vérification avec vous.
      </P>

      <H3>Étape 2 — Choisir un prestataire agréé</H3>
      <P>
        C'est une condition sine qua non : le prestataire que vous choisissez doit être{" "}
        <B>officiellement référencé</B> dans l'annuaire des prestataires Kap Numérik de la
        Région Réunion. Un prestataire non agréé ne peut pas faire bénéficier son client
        de l'aide, même si la prestation est de qualité.
      </P>

      <H3>Étape 3 — Monter le dossier</H3>
      <P>Le dossier comprend généralement :</P>
      <UL>
        <LI>Un devis détaillé du prestataire agréé</LI>
        <LI>Le formulaire officiel de demande d'aide Kap Numérik</LI>
        <LI>
          Les justificatifs de votre entreprise (KBIS, attestation fiscale et sociale à
          jour)
        </LI>
      </UL>

      <H3>Étape 4 — Validation et démarrage</H3>
      <P>
        Une fois le dossier validé par la Région Réunion (généralement 2 à 4 semaines),
        vous pouvez signer le devis avec votre prestataire. L'aide est directement
        soustraite du montant de la facture finale — vous ne payez que le reste.
      </P>

      <Blockquote>
        "J'accompagne mes clients dans toutes les démarches Kap Numérik, du dossier
        jusqu'à la livraison. Mon objectif : que vous obteniez l'aide à laquelle vous avez
        droit, sans stress administratif." — Nicolas MARRY, MARRYNOV
      </Blockquote>

      <H2>Exemples concrets de projets financés</H2>

      <TableResponsive
        headers={[
          "Type de projet",
          "Budget brut HT",
          "Aide Kap Numérik",
          "Reste à charge",
        ]}
        rows={[
          ["Site vitrine (5 pages)", "2 500 €", "jusqu'à 2 500 €", "0 à 300 €*"],
          ["Site e-commerce", "4 500 €", "3 200 €", "1 300 €"],
          ["Refonte + SEO avancé", "3 500 €", "3 200 €", "300 €"],
          ["Application mobile", "8 000 €", "3 200 €", "4 800 €"],
          ["Application métier", "6 000 €", "3 200 €", "2 800 €"],
        ]}
      />
      <p className="text-muted -mt-4 mb-6 text-xs">
        *Sous réserve d'éligibilité et des conditions en vigueur. Montants indicatifs HT.
      </p>

      <H2>Pourquoi agir maintenant ?</H2>
      <P>
        Les enveloppes Kap Numérik sont limitées et fonctionnent selon un système de
        premier arrivé, premier servi. En 2025, le budget a été épuisé avant la fin de
        l'exercice — plusieurs entreprises n'ont pas pu en bénéficier, faute de crédits
        disponibles.
      </P>
      <WarningBox>
        <p>
          <B>⚠️ Attention :</B> En 2026, les demandes sont déjà nombreuses dès le début de
          l'année. Plus vous attendez, plus vous risquez de manquer l'aide. Si vous avez
          un projet digital en tête, le moment d'agir, c'est maintenant.
        </p>
      </WarningBox>

      <FAQSection
        items={[
          {
            question: "Puis-je cumuler Kap Numérik avec d'autres aides ?",
            answer:
              "Dans certains cas, oui. Kap Numérik peut être cumulé avec d'autres dispositifs régionaux ou nationaux, sous réserve de ne pas dépasser 100 % du coût de la prestation. Demandez conseil à votre prestataire agréé ou à la Région Réunion pour votre situation spécifique.",
          },
          {
            question: "Kap Numérik couvre-t-il les applications mobiles ?",
            answer:
              "Oui, le développement d'applications mobiles iOS et/ou Android est bien éligible à l'aide Kap Numérik, à condition que la prestation soit réalisée par un prestataire officiellement agréé.",
          },
          {
            question: "Suis-je obligé de passer par un prestataire réunionnais ?",
            answer:
              "Oui, c'est une condition essentielle du dispositif. Le prestataire doit être basé à La Réunion et référencé dans l'annuaire officiel Kap Numérik. L'objectif du dispositif est précisément de soutenir l'économie locale et les prestataires de l'île.",
          },
          {
            question: "Combien de temps dure la procédure de validation ?",
            answer:
              "La validation du dossier par la Région prend généralement entre 2 et 4 semaines. Une fois le dossier accepté, vous pouvez démarrer votre projet immédiatement avec votre prestataire agréé.",
          },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article 2 — Combien coûte un site web à La Réunion
// ---------------------------------------------------------------------------

function ArticleCoutSiteWeb() {
  return (
    <div>
      <P>
        C'est la question que pose chaque entrepreneur réunionnais avant de se lancer dans
        la création de son site web : <B>combien ça va me coûter ?</B> Et la réponse
        honnête, c'est que ça dépend. Mais pas de façon arbitraire. Voyons ensemble ce qui
        détermine vraiment le prix d'un site web à La Réunion en 2026, et comment obtenir
        le meilleur rapport qualité/prix pour votre budget.
      </P>

      <H2>Les grandes catégories de sites web et leurs tarifs</H2>
      <P>
        Il existe une grande variété de sites web, avec des niveaux de complexité — et
        donc de prix — très différents. Voici un tableau de référence basé sur les tarifs
        réels du marché réunionnais en 2026.
      </P>

      <TableResponsive
        headers={["Type de site", "Tarif indicatif HT", "Délai moyen", "Pour qui ?"]}
        rows={[
          [
            "Site vitrine (3–5 pages)",
            "1 500 € – 3 500 €",
            "2–4 semaines",
            "Artisans, professions libérales, TPE",
          ],
          [
            "Site vitrine avancé (6–10 pages)",
            "3 500 € – 6 000 €",
            "4–6 semaines",
            "PME, commerces, restaurants",
          ],
          [
            "Site e-commerce",
            "4 000 € – 12 000 €",
            "6–10 semaines",
            "Boutiques, marques locales",
          ],
          [
            "Application web / SaaS",
            "8 000 € – 30 000 €+",
            "2–6 mois",
            "Startups, projets métier",
          ],
          [
            "Refonte de site existant",
            "1 500 € – 5 000 €",
            "3–6 semaines",
            "Toute entreprise",
          ],
        ]}
      />

      <InfoBox title="🎯 Avec Kap Numérik">
        <p>
          Ces budgets peuvent être réduits jusqu'à <B>3 200 €</B> grâce à l'aide Kap
          Numérik de la Région Réunion, accessible à toutes les TPE/PME réunionnaises. Un
          site vitrine peut donc revenir à <B>moins de 500 € net</B>.
        </p>
      </InfoBox>

      <H2>Ce qui influence vraiment le prix</H2>
      <P>
        Deux prestataires peuvent proposer des tarifs très différents pour un site «
        vitrine ». Voici les facteurs concrets qui expliquent les écarts.
      </P>

      <H3>1. Le nombre de pages et la complexité du design</H3>
      <P>
        Un site de 3 pages avec un template existant ne mobilise pas autant de travail
        qu'un site de 10 pages avec un design sur-mesure. Le travail de design (maquettes,
        charte graphique, illustrations) représente souvent 30 à 40 % du budget total.
      </P>

      <H3>2. Les fonctionnalités développées</H3>
      <P>
        Un formulaire de contact simple, c'est 1h de travail. Un espace client avec
        historique de commandes, c'est plusieurs semaines. Chaque fonctionnalité a un coût
        réel en temps de développement.
      </P>
      <UL>
        <LI>Formulaire de contact : inclus dans la plupart des offres</LI>
        <LI>Blog / actualités : +500 € à +1 500 €</LI>
        <LI>Paiement en ligne : +1 500 € à +3 000 €</LI>
        <LI>Espace client / connexion : +2 000 € à +5 000 €</LI>
        <LI>Multilingue (FR/EN/créole) : +800 € à +2 000 €</LI>
      </UL>

      <H3>3. Le SEO et les performances</H3>
      <P>
        Un site bien référencé sur Google demande un travail spécifique : structure
        technique, balises, vitesse de chargement, contenu optimisé. Ce n'est pas
        automatique. Un prestataire qui inclut un vrai travail SEO dans son offre justifie
        un tarif plus élevé — et vous rapportera bien plus à terme.
      </P>

      <H3>4. La maintenance et l'hébergement</H3>
      <P>
        Le prix de création n'est pas le seul coût à prendre en compte. Pensez à prévoir
        un budget annuel pour l'hébergement (50 € à 200 €/an), le nom de domaine (10 à 20
        €/an) et la maintenance (150 € à 500 €/an pour les mises à jour, sauvegardes et
        sécurité).
      </P>

      <H2>Freelance vs agence web : les différences de prix</H2>
      <P>
        À La Réunion, on trouve principalement deux types de prestataires web : les
        freelances et les agences. Les prix varient significativement entre les deux.
      </P>

      <TableResponsive
        headers={["Critère", "Freelance", "Agence web"]}
        rows={[
          ["Tarif journalier moyen", "300 € – 600 €/jour", "500 € – 1 200 €/jour"],
          ["Site vitrine standard", "1 500 € – 3 500 €", "3 500 € – 8 000 €"],
          ["Interlocuteur", "Direct avec le développeur", "Chef de projet intermédiaire"],
          ["Délais", "Souvent plus courts", "Souvent plus longs"],
          ["Réactivité", "Très bonne", "Variable"],
        ]}
      />
      <P>
        Un freelance expérimenté peut tout à fait livrer un travail de qualité supérieure
        à celui d'une agence, pour un prix inférieur. La clé est de vérifier son
        portfolio, ses références et sa méthode de travail.
      </P>

      <H2>Comment optimiser son budget ?</H2>
      <H3>1. Profiter de Kap Numérik</H3>
      <P>
        C'est l'aide la plus puissante disponible à La Réunion. Jusqu'à 3 200 € pris en
        charge par la Région, directement déduits de votre facture. Voir notre guide dédié
        à Kap Numérik pour toutes les informations.
      </P>
      <H3>2. Préparer votre brief avant le devis</H3>
      <P>
        Plus votre cahier des charges est précis, plus le devis sera juste et les
        surprises évitées. Listez vos pages souhaitées, les fonctionnalités
        indispensables, votre charte graphique (couleurs, logo) et vos exemples de sites
        que vous aimez.
      </P>
      <H3>3. Prioriser les fonctionnalités essentielles</H3>
      <P>
        Commencez par le minimum viable : un site propre, performant et bien référencé.
        Vous pourrez toujours ajouter des fonctionnalités plus tard. Un site simple bien
        fait vaut mieux qu'un site complexe mal réalisé.
      </P>

      <Blockquote>
        "Le coût d'un site web, c'est un investissement, pas une dépense. Un bon site web,
        c'est un commercial qui travaille pour vous 24h/24, 7j/7, partout à La Réunion et
        au-delà." — Nicolas MARRY, MARRYNOV
      </Blockquote>

      <FAQSection
        items={[
          {
            question: "Pourquoi certains devis sont-ils si bas (500 € ou moins) ?",
            answer:
              "Les devis très bas cachent généralement des templates génériques sans personnalisation, du travail bâclé sur le SEO, l'absence de maintenance, ou des prestataires hors Réunion qui ne connaissent pas le marché local. Un site à 500 € peut vous coûter beaucoup plus cher à terme si vous devez le refaire rapidement.",
          },
          {
            question: "Le prix comprend-il l'hébergement ?",
            answer:
              "Cela dépend du prestataire. Certains incluent la première année d'hébergement dans leur offre, d'autres la facturent séparément. Demandez toujours ce qui est inclus dans le prix avant de signer.",
          },
          {
            question: "Dois-je payer des frais de mise à jour après la livraison ?",
            answer:
              "Les petites modifications de contenu (textes, photos) sont souvent incluses dans une période de garantie de 1 à 3 mois. Au-delà, un contrat de maintenance mensuel est recommandé pour garder votre site sécurisé et à jour.",
          },
          {
            question: "Est-ce que je peux être propriétaire de mon site ?",
            answer:
              "Absolument. Avec un bon prestataire, vous êtes propriétaire à 100 % de votre site, du nom de domaine et du code source. Méfiez-vous des offres où le prestataire reste propriétaire de l'hébergement ou du domaine.",
          },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article 3 — Pourquoi votre entreprise réunionnaise a besoin d'un site web
// ---------------------------------------------------------------------------

function ArticlePourquoiSiteWeb() {
  return (
    <div>
      <P>
        En 2026, ne pas avoir de site web c'est comme ne pas avoir d'adresse. Vos clients
        potentiels vous cherchent sur Google avant de vous appeler. Vos concurrents sont
        déjà en ligne. Et pourtant, une grande partie des TPE et PME réunionnaises n'ont
        toujours pas de présence digitale digne de ce nom. Voici pourquoi c'est une erreur
        — et comment y remédier simplement.
      </P>

      <H2>1. Vos clients vous cherchent sur Google</H2>
      <P>
        Selon les données récentes, <B>plus de 87 % des consommateurs</B> effectuent une
        recherche en ligne avant de contacter un prestataire ou de se rendre dans un
        commerce. À La Réunion, ce comportement est identique, voire amplifié avec la
        pénétration croissante des smartphones.
      </P>
      <P>
        Si votre entreprise n'apparaît pas sur Google quand un Réunionnais cherche votre
        service, ce client ira chez votre concurrent qui, lui, est en ligne. C'est aussi
        simple que ça.
      </P>

      <H2>2. Un site web, c'est votre meilleur commercial</H2>
      <P>
        Un commercial coûte 30 000 € à 50 000 € par an. Un bon site web coûte 2 000 à 5
        000 € à créer, et quelques centaines d'euros par an à maintenir. Et il travaille
        pour vous <B>24h/24, 7j/7</B>, même pendant les jours fériés et les week-ends.
      </P>
      <P>
        Votre site présente vos services, répond aux questions fréquentes de vos clients,
        affiche vos tarifs et génère des demandes de devis — sans que vous ayez besoin
        d'être disponible.
      </P>

      <H2>3. Vous gagnez en crédibilité instantanément</H2>
      <P>
        Un prospect qui ne trouve pas votre site web doute de votre sérieux. En 2026, ne
        pas avoir de site web envoie un signal négatif : est-ce que cette entreprise est
        encore active ? Est-elle professionnelle ?
      </P>
      <P>
        À l'inverse, un site soigné, avec vos réalisations, vos avis clients et vos
        coordonnées claires, <B>rassure et convertit</B>. C'est votre carte de visite
        permanente, accessible à n'importe qui, depuis n'importe où à La Réunion.
      </P>

      <H2>4. Vous pouvez attirer des clients hors de votre zone géographique</H2>
      <P>
        Un commerce physique à Saint-Denis ne peut attirer que les clients qui passent
        devant. Un site web, lui, peut attirer des clients de Saint-Pierre, Saint-Paul,
        Saint-Benoît — et même de métropole.
      </P>
      <P>
        Pour les prestataires de services (consultants, développeurs, formateurs, coachs),
        le site web permet de travailler à distance et d'élargir considérablement sa zone
        de chalandise.
      </P>

      <H2>5. Vous pouvez bénéficier d'une aide de 3 200 €</H2>
      <P>
        Si vous êtes une entreprise réunionnaise, la Région finance votre site web via le
        dispositif Kap Numérik. Jusqu'à <B>3 200 €</B> peuvent être déduits directement de
        votre facture. Un site vitrine peut donc vous revenir à <B>moins de 500 €</B>.
      </P>

      <InfoBox title="💡 À savoir">
        <p>
          L'aide Kap Numérik est accessible aux artisans, commerçants, professions
          libérales et PME réunionnaises. Elle est directement déduite de la facture —
          vous n'avancez rien.
        </p>
      </InfoBox>

      <H2>6. Vos concurrents sont déjà en ligne</H2>
      <P>
        Le marché du digital à La Réunion est en pleine expansion. Chaque mois, de
        nouvelles entreprises créent leur site web. Si vous attendez encore, vous laissez
        le terrain libre à vos concurrents sur Google Maps, sur les recherches locales,
        sur les réseaux sociaux.
      </P>
      <P>
        Le référencement (SEO) prend du temps pour s'établir. Plus vous commencez tôt,
        plus vite votre site sera visible. Attendre, c'est laisser votre concurrent
        prendre l'avantage.
      </P>

      <H2>7. Un site web, c'est aussi un outil de fidélisation</H2>
      <P>
        Au-delà d'attirer de nouveaux clients, votre site web permet de garder le contact
        avec vos clients existants : blog d'actualités, newsletter, promotions,
        nouveautés. C'est un canal de communication que vous contrôlez entièrement, sans
        dépendre des algorithmes des réseaux sociaux.
      </P>

      <Blockquote>
        "Mes clients à La Réunion qui ont franchi le pas et créé leur site web constatent
        tous la même chose : ils reçoivent des demandes de contact qu'ils n'auraient
        jamais eu autrement. Internet ne dort jamais." — Nicolas MARRY, MARRYNOV
      </Blockquote>

      <H2>Par où commencer ?</H2>
      <P>Créer un site web ne demande pas des mois de préparation. En pratique :</P>
      <OL>
        <OLI>
          <B>Définissez vos objectifs :</B> attirer des clients ? Vendre en ligne ?
          Présenter votre portfolio ?
        </OLI>
        <OLI>
          <B>Rassemblez vos contenus :</B> textes, photos de vos produits ou services,
          logo.
        </OLI>
        <OLI>
          <B>Choisissez un prestataire Kap Numérik agréé</B> pour bénéficier de l'aide
          financière.
        </OLI>
        <OLI>
          <B>Lancez-vous :</B> un site vitrine simple peut être en ligne en 3 semaines.
        </OLI>
      </OL>

      <FAQSection
        items={[
          {
            question: "Est-ce qu'une page Facebook remplace un site web ?",
            answer:
              "Non, et c'est une idée reçue dangereuse. Une page Facebook dépend des algorithmes de Meta — votre portée peut chuter du jour au lendemain. Vous ne possédez pas vos données clients. Et surtout, une page Facebook n'apparaît pas dans les résultats Google pour des recherches locales comme 'plombier réunion' ou 'coiffeur saint-denis'. Un site web vous appartient, personne ne peut vous le retirer.",
          },
          {
            question:
              "Combien de temps faut-il pour voir les premiers résultats sur Google ?",
            answer:
              "Pour un site bien optimisé, les premiers résultats sur Google peuvent apparaître en 4 à 8 semaines. Le référencement local (via Google My Business notamment) peut donner des résultats encore plus rapides. En règle générale, comptez 3 à 6 mois pour un positionnement solide sur vos mots-clés principaux.",
          },
          {
            question: "Mon site web devra-t-il être mis à jour régulièrement ?",
            answer:
              "Un site vitrine ne nécessite pas de mises à jour de contenu très fréquentes — mettez à jour vos tarifs, coordonnées et photos quand nécessaire. En revanche, les mises à jour techniques (sécurité, framework) sont importantes et se font en coulisses, généralement dans le cadre d'un contrat de maintenance.",
          },
          {
            question: "Ai-je besoin de connaissances techniques pour gérer mon site ?",
            answer:
              "Non. Un bon prestataire vous forme à la prise en main et vous livre un site que vous pouvez gérer vous-même pour les modifications simples. Pour les évolutions complexes, votre prestataire reste disponible.",
          },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article 4 — Facturation électronique 2026 PME réunionnaises
// ---------------------------------------------------------------------------

function ArticleFacturationElectronique() {
  return (
    <div>
      <P>
        La facturation électronique obligatoire est l'une des réformes fiscales les plus
        importantes de la décennie pour les entreprises françaises — et les PME
        réunionnaises ne font pas exception. À partir de <B>septembre 2026</B>, toutes les
        PME devront être capables de recevoir des factures électroniques. Et dès{" "}
        <B>2027</B>, l'obligation s'étend à l'émission. Ce guide vous explique ce que ça
        change concrètement et comment vous y préparer.
      </P>

      <H2>Qu'est-ce que la facturation électronique obligatoire ?</H2>
      <P>
        On parle ici d'un format de facture structuré et normalisé, transmis via une{" "}
        <B>Plateforme de Dématérialisation Partenaire (PDP)</B> agréée par l'État. Ce
        n'est pas simplement envoyer un PDF par email — c'est un flux de données
        électroniques qui transite par des plateformes officielles et alimente
        automatiquement les déclarations fiscales.
      </P>

      <WarningBox>
        <p>
          <B>⚠️ Important :</B> Un simple PDF envoyé par email n'est PAS une facture
          électronique au sens de la réforme. La mise en conformité nécessite un logiciel
          ou une plateforme agréée.
        </p>
      </WarningBox>

      <H2>Le calendrier de déploiement</H2>

      <TableResponsive
        headers={["Date", "Obligation", "Qui est concerné ?"]}
        rows={[
          [
            "1er septembre 2026",
            "Réception de factures électroniques",
            "Toutes les entreprises (TPE, PME, grandes)",
          ],
          [
            "1er septembre 2026",
            "Émission de factures électroniques",
            "Grandes entreprises (> 5 000 salariés)",
          ],
          ["1er septembre 2027", "Émission obligatoire", "ETI (250–5 000 salariés)"],
          ["1er septembre 2027", "Émission obligatoire", "PME et TPE (< 250 salariés)"],
        ]}
      />

      <P>
        En pratique, si vous êtes une PME ou TPE réunionnaise, vous avez jusqu'au{" "}
        <B>1er septembre 2027</B> pour être capable d'émettre vos factures en format
        électronique. Mais vous devez être prêt à en <B>recevoir dès septembre 2026</B>.
      </P>

      <H2>Comment se mettre en conformité ?</H2>
      <H3>Option 1 — Utiliser le portail public Chorus Pro (gratuit)</H3>
      <P>
        Le portail Chorus Pro, géré par l'État, permet aux entreprises d'émettre et de
        recevoir des factures électroniques gratuitement. C'est la solution de base,
        adaptée aux très petites structures avec peu de factures par mois. L'interface est
        fonctionnelle mais peu intuitive.
      </P>

      <H3>Option 2 — Passer par une Plateforme de Dématérialisation Partenaire (PDP)</H3>
      <P>
        Des acteurs privés agréés par l'État proposent des plateformes plus ergonomiques,
        souvent connectées à vos logiciels de gestion existants. Ces solutions sont
        payantes (à partir de quelques dizaines d'euros par mois) mais bien plus pratiques
        pour un usage professionnel régulier.
      </P>
      <P>Quelques PDP connues sur le marché français :</P>
      <UL>
        <LI>Sage (pour les utilisateurs de Sage Gestion commerciale)</LI>
        <LI>Cegid, Quadratus, EBP (pour leurs utilisateurs)</LI>
        <LI>Pennylane, Axonaut, Sellsy (solutions cloud modernes)</LI>
        <LI>Chorus Pro (portail gratuit de l'État)</LI>
      </UL>

      <H3>Option 3 — Développer une solution sur mesure</H3>
      <P>
        Pour les entreprises avec des besoins spécifiques (volumes importants, intégration
        avec un ERP existant, workflow de validation complexe), une solution sur mesure
        peut être développée. C'est l'une des prestations que propose MARRYNOV aux PME
        réunionnaises.
      </P>

      <InfoBox title="🏝️ Spécificité réunionnaise">
        <p>
          Les entreprises réunionnaises ayant des relations commerciales interentreprises
          (B2B) avec la métropole ou avec des grandes entreprises locales sont
          particulièrement concernées en priorité. Si vous facturez des grandes
          entreprises ou des collectivités à La Réunion, préparez-vous dès maintenant.
        </p>
      </InfoBox>

      <H2>Les étapes concrètes pour se préparer</H2>
      <OL>
        <OLI>
          <B>Évaluez votre situation :</B> Combien de factures émettez-vous par mois ? À
          qui (B2B, B2C, collectivités) ? Quel logiciel de facturation utilisez-vous
          actuellement ?
        </OLI>
        <OLI>
          <B>Choisissez votre solution :</B> Chorus Pro (gratuit mais basique) ou PDP
          privée (payante mais plus ergonomique). Votre expert-comptable peut vous
          conseiller.
        </OLI>
        <OLI>
          <B>Formez votre équipe :</B> La transition vers la facturation électronique
          nécessite une formation minimale pour les personnes qui gèrent la facturation au
          quotidien.
        </OLI>
        <OLI>
          <B>Testez avant l'échéance :</B> Ne laissez pas la mise en conformité à la
          dernière minute. Testez votre solution plusieurs mois avant septembre 2026 pour
          détecter les problèmes.
        </OLI>
        <OLI>
          <B>Mettez à jour vos contrats et CGV :</B> Vos conditions générales de vente
          devront mentionner le mode de facturation électronique.
        </OLI>
      </OL>

      <H2>Quelles sanctions en cas de non-conformité ?</H2>
      <P>
        Le non-respect de l'obligation de facturation électronique peut entraîner des
        amendes fiscales. La Direction Générale des Finances Publiques (DGFiP) dispose des
        moyens de contrôler la conformité des flux de facturation. Le risque est également
        opérationnel : vos clients grands comptes pourraient refuser de vous payer si vous
        ne pouvez pas émettre de facture conforme.
      </P>

      <Blockquote>
        "La facturation électronique, c'est une contrainte administrative au départ, mais
        c'est aussi une opportunité : moins de saisie manuelle, moins d'erreurs,
        traitement comptable plus rapide. Les entreprises qui s'y préparent maintenant
        auront une longueur d'avance." — Nicolas MARRY, MARRYNOV
      </Blockquote>

      <FAQSection
        items={[
          {
            question:
              "Suis-je concerné si je facture uniquement des particuliers (B2C) ?",
            answer:
              "La réforme concerne principalement les factures entre entreprises (B2B). Si vous facturez exclusivement des particuliers, vous n'êtes pas directement concerné par l'obligation d'émission. En revanche, vous devrez quand même être en mesure de recevoir des factures électroniques de vos fournisseurs.",
          },
          {
            question: "Mon expert-comptable peut-il gérer ça à ma place ?",
            answer:
              "Votre expert-comptable peut vous conseiller sur le choix de la solution et la transition. Mais c'est vous (ou votre logiciel de gestion) qui devrez être en mesure d'émettre et de recevoir les factures électroniques au quotidien. L'expert-comptable n'est pas l'émetteur des factures à votre place.",
          },
          {
            question:
              "La facturation électronique est-elle obligatoire pour les micro-entreprises ?",
            answer:
              "Oui, à terme. Les micro-entrepreneurs (auto-entrepreneurs) sont inclus dans la réforme en tant que TPE. L'obligation d'émission sera effective au 1er septembre 2027. Cependant, si vous utilisez déjà des plateformes comme Shine, Qonto ou Fresha qui intègreront la facturation électronique, la transition sera transparente.",
          },
          {
            question: "Combien coûte la mise en conformité ?",
            answer:
              "Cela dépend de votre situation. Le portail Chorus Pro est gratuit. Les PDP privées coûtent entre 20 et 200 €/mois selon les fonctionnalités. Une solution sur mesure intégrée à votre ERP est sur devis. L'investissement est généralement rentabilisé rapidement grâce aux gains de temps sur la saisie et la comptabilité.",
          },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article 5 — Application mobile EHPAD et cliniques La Réunion
// ---------------------------------------------------------------------------

function ArticleApplicationMobileEHPAD() {
  return (
    <div>
      <P>
        Pendant 6 ans, j'ai développé des applications pour des EHPAD, hôpitaux et
        cabinets médicaux. J'ai vu de près les enjeux de la digitalisation du secteur
        santé à La Réunion : les besoins réels des soignants, les contraintes
        réglementaires, et les erreurs classiques que font les établissements qui se
        lancent sans préparation. Ce guide est un condensé de ce que j'ai appris.
      </P>

      <H2>Pourquoi les établissements de santé se digitalisent-ils ?</H2>
      <P>
        La digitalisation des EHPAD et cliniques à La Réunion n'est plus une option, c'est
        une nécessité opérationnelle. Les raisons sont multiples :
      </P>
      <UL>
        <LI>
          <B>Réduire les erreurs médicales</B> liées aux transmissions orales ou
          manuscrites entre équipes
        </LI>
        <LI>
          <B>Améliorer la continuité des soins</B> grâce à un accès rapide aux dossiers
          patients depuis n'importe quel terminal
        </LI>
        <LI>
          <B>Optimiser la charge administrative</B> des soignants pour qu'ils se
          concentrent sur le patient
        </LI>
        <LI>
          <B>Faciliter la communication</B> entre équipes, familles et médecins référents
        </LI>
        <LI>
          <B>Répondre aux obligations réglementaires</B> croissantes (DMP, traçabilité des
          actes, RGPD)
        </LI>
      </UL>

      <H2>Les fonctionnalités clés d'une application santé efficace</H2>
      <H3>1. Gestion des dossiers patients</H3>
      <P>
        Le cœur d'une application santé. Chaque patient dispose d'un dossier numérique
        centralisé : antécédents, traitements en cours, allergies, observations des
        soignants, historique des actes. Accessible depuis une tablette ou un smartphone,
        avec les droits appropriés selon le profil de l'utilisateur (médecin,
        aide-soignant, administration).
      </P>

      <H3>2. Transmissions et traçabilité</H3>
      <P>
        Fini les cahiers de transmissions manuscrits illisibles. Une application bien
        conçue permet aux équipes de documenter chaque acte en temps réel, avec horodatage
        automatique. Les soignants du service suivant trouvent une information claire et
        complète à leur prise de poste.
      </P>

      <H3>3. Planification et gestion des plannings</H3>
      <P>
        Gestion des tournées infirmières, planning des résidents (repas, bains,
        activités), organisation des consultations médicales. Un bon module de planning
        réduit le temps de coordination et évite les doublons ou oublis.
      </P>

      <H3>4. Communication famille-établissement</H3>
      <P>
        Les familles des résidents d'EHPAD souhaitent des nouvelles régulières. Un portail
        famille sécurisé permet de partager photos, actualités de l'établissement et
        informations importantes, sans surcharger les équipes soignantes.
      </P>

      <H3>5. Gestion des médicaments</H3>
      <P>
        La distribution des médicaments est un acte à fort risque d'erreur. Une
        application avec lecture de QR code ou code-barres permet de vérifier en temps
        réel que le bon médicament est donné au bon patient, à la bonne dose et au bon
        moment.
      </P>

      <H2>Les contraintes réglementaires à respecter</H2>
      <P>
        C'est ici que beaucoup de projets échouent. Une application pour le secteur santé
        n'est pas comme une application de commande de pizza. Elle doit respecter un cadre
        réglementaire strict.
      </P>

      <H3>Hébergement des Données de Santé (HDS)</H3>
      <P>
        Toutes les données de santé à caractère personnel doivent être hébergées chez un
        hébergeur certifié HDS (Hébergeur de Données de Santé). Cette certification est
        délivrée par l'ANS (Agence du Numérique en Santé). En pratique, cela implique de
        choisir un infrastructure cloud ou serveur spécifiquement certifié — et pas
        n'importe quel hébergeur classique.
      </P>

      <H3>RGPD renforcé pour les données de santé</H3>
      <P>
        Les données de santé sont des données sensibles au sens du RGPD. Leur traitement
        est soumis à des obligations supplémentaires : consentement explicite des
        patients, registre de traitement, analyse d'impact (PIA), désignation d'un DPO si
        nécessaire.
      </P>

      <H3>Interopérabilité avec les systèmes existants</H3>
      <P>
        Votre application devra souvent communiquer avec d'autres systèmes : DMP (Dossier
        Médical Partagé), logiciels de pharmacie, systèmes de facturation, téléphonie
        médicale. Ces intégrations requièrent une expertise technique spécifique.
      </P>

      <InfoBox title="🔒 Expertise MARRYNOV en santé numérique">
        <p>
          Ayant travaillé 6 ans dans le développement d'applications pour le secteur
          santé, je maîtrise ces contraintes réglementaires. Je travaille exclusivement
          avec des hébergeurs HDS certifiés et intègre les bonnes pratiques RGPD dès la
          conception de l'application.
        </p>
      </InfoBox>

      <H2>Budget et délais pour un projet santé numérique</H2>

      <TableResponsive
        headers={["Type de solution", "Budget indicatif HT", "Délai de développement"]}
        rows={[
          ["Application de transmissions simple", "8 000 € – 15 000 €", "8–12 semaines"],
          ["Portail famille (EHPAD)", "5 000 € – 10 000 €", "6–10 semaines"],
          ["Gestion complète EHPAD", "20 000 € – 50 000 €", "4–8 mois"],
          ["Application de prescription médicale", "15 000 € – 35 000 €", "4–6 mois"],
          ["Intégration DMP / pharmacie", "10 000 € – 25 000 €+", "3–5 mois"],
        ]}
      />
      <p className="text-muted -mt-4 mb-6 text-xs">
        Estimations indicatives. Chaque projet est chiffré sur devis après analyse des
        besoins.
      </p>

      <Blockquote>
        "Le secteur santé, c'est un domaine où l'erreur n'est pas permise. J'ai appris à
        travailler avec une rigueur extrême, en pensant d'abord à la sécurité du patient
        et à la facilité d'usage pour les soignants — qui n'ont pas le temps d'apprendre
        un outil complexe." — Nicolas MARRY, MARRYNOV
      </Blockquote>

      <FAQSection
        items={[
          {
            question:
              "Faut-il obligatoirement un hébergement HDS pour une application EHPAD ?",
            answer:
              "Oui, dès lors que vous stockez des données de santé à caractère personnel (ce qui est le cas dès que vous gérez des dossiers patients). L'hébergement HDS n'est pas une option — c'est une obligation légale. Le non-respect peut entraîner des sanctions importantes de la CNIL.",
          },
          {
            question:
              "Peut-on utiliser des solutions existantes du marché plutôt que du sur-mesure ?",
            answer:
              "Absolument. Des logiciels comme Netsoins, Titan, ou Soarian existent pour les EHPAD. Le développement sur-mesure est pertinent quand vos besoins sont très spécifiques, que vous souhaitez vous différencier ou que vous avez des intégrations particulières avec vos autres systèmes. Je peux vous aider à évaluer si le sur-mesure est justifié pour votre situation.",
          },
          {
            question: "Comment impliquer les équipes soignantes dans le projet ?",
            answer:
              "C'est la clé du succès. J'implique toujours des représentants des utilisateurs finaux dès la phase de conception (ateliers de co-design). Une application que les soignants n'utilisent pas, c'est de l'argent gaspillé. La formation à la livraison est également indispensable.",
          },
          {
            question: "La solution peut-elle fonctionner hors connexion ?",
            answer:
              "Oui, c'est techniquement possible avec une architecture offline-first. Les données sont synchronisées dès que la connexion est rétablie. C'est particulièrement important pour les établissements avec une couverture réseau instable, ce qui peut être le cas dans certaines zones de La Réunion.",
          },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Article 6 — Freelance vs agence web La Réunion
// ---------------------------------------------------------------------------

function ArticleFreelanceVsAgence() {
  return (
    <div>
      <P>
        Vous avez un projet de site web ou d'application à La Réunion et vous hésitez
        entre faire appel à un freelance ou à une agence web ? C'est une question légitime
        — et la réponse n'est pas universelle. Elle dépend de votre projet, de votre
        budget, et de ce que vous valorisez dans une collaboration. Voici un comparatif
        honnête, sans langue de bois.
      </P>

      <H2>Les différences fondamentales</H2>
      <P>Avant de comparer, clarifions ce que recouvrent ces deux options.</P>

      <H3>Le freelance</H3>
      <P>
        Un freelance est un prestataire indépendant qui travaille seul (ou avec un réseau
        de sous-traitants ponctuels). Vous avez un interlocuteur direct, souvent le
        développeur lui-même. La communication est fluide, la réactivité généralement
        bonne.
      </P>

      <H3>L'agence web</H3>
      <P>
        Une agence regroupe plusieurs profils : commercial, chef de projet, designers,
        développeurs, experts SEO. Elle peut gérer des projets plus larges et proposer des
        compétences plus variées sous un même toit. En contrepartie, vous passez souvent
        par un chef de projet qui relaie vos demandes aux équipes techniques.
      </P>

      <H2>Comparatif objectif</H2>

      <TableResponsive
        headers={["Critère", "Freelance", "Agence web"]}
        rows={[
          ["Prix moyen (site vitrine)", "1 500 € – 3 500 €", "3 500 € – 8 000 €"],
          [
            "Interlocuteur",
            "Direct avec le développeur",
            "Chef de projet (intermédiaire)",
          ],
          ["Réactivité", "Généralement très bonne", "Variable selon les agences"],
          ["Disponibilité", "Dépend du carnet de commandes", "Plus prévisible"],
          ["Capacité à scaler", "Limitée (projet complexe)", "Adaptée aux gros projets"],
          ["Personnalisation", "Très élevée", "Bonne mais process plus rigide"],
          [
            "Continuité en cas d'absence",
            "Risque si prestataire unique",
            "Équipe en place",
          ],
          [
            "Spécialisation sectorielle",
            "Possible (profils experts)",
            "Variable selon l'agence",
          ],
        ]}
      />

      <H2>Quand choisir un freelance ?</H2>
      <UL>
        <LI>
          Votre budget est inférieur à 5 000 € et vous avez besoin d'un rapport
          qualité/prix optimal
        </LI>
        <LI>
          Vous voulez communiquer directement avec la personne qui développe votre projet
        </LI>
        <LI>
          Votre projet est bien défini et de taille raisonnable (site vitrine, application
          mobile simple)
        </LI>
        <LI>
          Vous valorisez la flexibilité et la réactivité plus que les process formels
        </LI>
        <LI>
          Vous avez besoin d'une expertise sectorielle spécifique (santé, e-commerce de
          niche, etc.)
        </LI>
      </UL>

      <H2>Quand choisir une agence web ?</H2>
      <UL>
        <LI>
          Votre projet est complexe et implique plusieurs corps de métier simultanément
          (design, dev, SEO, conseil marketing)
        </LI>
        <LI>
          Vous avez besoin d'une garantie de continuité (SLA formalisé, équipe de
          remplacement)
        </LI>
        <LI>
          Votre budget dépasse 10 000 à 15 000 € et la valeur d'une structure établie est
          importante pour vous
        </LI>
        <LI>
          Vous avez un projet de plateforme à grande échelle avec des contraintes
          d'intégration complexes
        </LI>
      </UL>

      <H2>Le piège à éviter : le prix seul</H2>
      <P>
        Beaucoup d'entreprises réunionnaises choisissent leur prestataire web uniquement
        sur le critère du prix. C'est une erreur classique.
      </P>
      <P>
        Un site à 500 € livré par quelqu'un qui a utilisé un template WordPress gratuit,
        sans optimisation SEO, sans performance et sans formation, peut vous coûter bien
        plus cher à terme : refonte prématurée, mauvais référencement, perte de clients,
        temps passé à corriger des problèmes.
      </P>
      <P>
        À l'inverse, une agence avec un budget de 8 000 € n'est pas automatiquement
        meilleure qu'un freelance expérimenté à 3 000 €. Le vrai critère, c'est{" "}
        <B>le portfolio, les références et la méthode de travail</B>.
      </P>

      <InfoBox title="✅ Les bons critères de sélection">
        <UL>
          <LI>Portfolio : des réalisations dans votre secteur ou similaires ?</LI>
          <LI>Références : des clients locaux avec qui vous pouvez échanger ?</LI>
          <LI>
            Méthode : comment gère-t-il le projet ? Quels livrables à chaque étape ?
          </LI>
          <LI>Clarté du devis : chaque poste est-il détaillé et justifié ?</LI>
          <LI>
            Propriété du travail : êtes-vous bien propriétaire du code, du domaine et de
            l'hébergement ?
          </LI>
        </UL>
      </InfoBox>

      <H2>Et Kap Numérik dans tout ça ?</H2>
      <P>
        L'aide Kap Numérik de la Région Réunion (jusqu'à 3 200 €) est accessible que vous
        choisissiez un freelance agréé ou une agence agréée. La condition est que le
        prestataire soit <B>officiellement référencé</B> dans l'annuaire Kap Numérik.
        Vérifiez toujours ce point avant de signer.
      </P>

      <Blockquote>
        "Je suis freelance, et je suis honnête sur ce que ça implique : vous aurez un
        interlocuteur unique, réactif et impliqué. Ce que je ne peux pas offrir qu'une
        agence peut, c'est une équipe de 10 personnes sur votre projet simultanément. Pour
        les projets à La Réunion de moins de 15 000 €, un freelance expérimenté est
        souvent le meilleur choix." — Nicolas MARRY, MARRYNOV
      </Blockquote>

      <FAQSection
        items={[
          {
            question: "Un freelance peut-il sous-traiter une partie du travail ?",
            answer:
              "Oui, c'est courant et tout à fait légitime. Un développeur peut sous-traiter le design à un graphiste freelance par exemple. L'important est que le freelance reste responsable de la qualité de la prestation finale et qu'il vous en informe clairement.",
          },
          {
            question: "Comment vérifier les compétences d'un freelance ?",
            answer:
              "Demandez son portfolio et des références de clients précédents (idéalement des entreprises réunionnaises que vous pouvez contacter). Regardez la qualité et les performances des sites réalisés. Un appel découverte gratuit vous donnera aussi une bonne idée de son sérieux et de sa méthode de travail.",
          },
          {
            question:
              "Que se passe-t-il si le freelance tombe malade ou arrête son activité ?",
            answer:
              "C'est un risque réel. Pour le limiter, exigez que le code source soit remis à la livraison et qu'il soit bien documenté. Assurez-vous également d'avoir accès à tous les outils : hébergement, domaine, CMS. Vous devez pouvoir continuer avec un autre prestataire si nécessaire.",
          },
          {
            question:
              "Les agences réunionnaises sont-elles meilleures que les agences métropolitaines ?",
            answer:
              "Pas automatiquement, mais elles ont un avantage concret : elles connaissent le marché local, les spécificités culturelles, les aides disponibles comme Kap Numérik, et peuvent se déplacer facilement. La proximité géographique reste un vrai avantage pour un projet web professionnel.",
          },
        ]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export map
// ---------------------------------------------------------------------------

export const BLOG_CONTENT: Record<string, React.FC> = {
  "aide-kap-numerik-2026": ArticleKapNumerik,
  "combien-coute-site-web-reunion-2026": ArticleCoutSiteWeb,
  "pourquoi-site-web-entreprise-reunion": ArticlePourquoiSiteWeb,
  "facturation-electronique-2026-pme-reunionnaises": ArticleFacturationElectronique,
  "application-mobile-ehpad-cliniques-reunion": ArticleApplicationMobileEHPAD,
  "freelance-vs-agence-web-reunion": ArticleFreelanceVsAgence,
};
