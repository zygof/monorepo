export type BlogCategory = {
  slug: string;
  label: string;
  description: string;
};

export type BlogArticle = {
  slug: string;
  category: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  targetKeywords: string[];
  excerpt: string;
  readTime: number;
  publishedAt: string;
  status: "published" | "draft";
  priority: number;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "aides-financieres",
    label: "Aides financières",
    description:
      "Subventions, dispositifs et aides pour financer votre projet digital à La Réunion.",
  },
  {
    slug: "guide-pratique",
    label: "Guide pratique",
    description: "Conseils concrets pour les entrepreneurs et PME réunionnais.",
  },
  {
    slug: "tech-accessible",
    label: "Tech accessible",
    description: "La technologie expliquée simplement, sans jargon.",
  },
  {
    slug: "sante-numerique",
    label: "Santé numérique",
    description: "Applications, logiciels et solutions pour le secteur de la santé.",
  },
  {
    slug: "actualites",
    label: "Actualités",
    description: "Les dernières nouvelles du digital à La Réunion.",
  },
];

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "aide-kap-numerik-2026",
    category: "aides-financieres",
    title:
      "Aide Kap Numérik 2026 : comment financer votre site web à La Réunion jusqu'à 3 200 €",
    metaTitle:
      "Aide Kap Numérik 2026 : financer votre site web à La Réunion jusqu'à 3 200 €",
    metaDescription:
      "Guide complet sur l'aide Kap Numérik 2026 à La Réunion : montants, conditions, démarches et prestataires agréés. Jusqu'à 3 200 € pour votre projet digital.",
    targetKeywords: [
      "kap numérik développeur",
      "aide site web réunion",
      "kap numérik 2026",
      "financement site web réunion",
      "prestataire kap numérik réunion",
    ],
    excerpt:
      "Kap Numérik permet aux entreprises réunionnaises d'obtenir jusqu'à 3 200 € pour financer leur site web ou application. Découvrez comment en bénéficier étape par étape.",
    readTime: 8,
    publishedAt: "2026-02-10",
    status: "published",
    priority: 1,
  },
  {
    slug: "combien-coute-site-web-reunion-2026",
    category: "guide-pratique",
    title: "Combien coûte un site web à La Réunion en 2026 ? (tarifs réels)",
    metaTitle: "Combien coûte un site web à La Réunion en 2026 ? (tarifs réels)",
    metaDescription:
      "Prix réels d'un site web à La Réunion en 2026 : site vitrine, e-commerce, application web. Comparatif freelance vs agence, et aides disponibles pour réduire la facture.",
    targetKeywords: [
      "prix site web réunion",
      "tarif création site internet 974",
      "coût site vitrine réunion",
      "tarif développeur web réunion",
      "combien site web réunion",
    ],
    excerpt:
      "Un site vitrine à 800 € ou à 5 000 € ? On décortique les vrais tarifs du marché réunionnais et ce qui justifie les écarts de prix.",
    readTime: 10,
    publishedAt: "2026-02-12",
    status: "published",
    priority: 2,
  },
  {
    slug: "pourquoi-site-web-entreprise-reunion",
    category: "guide-pratique",
    title: "Pourquoi votre entreprise réunionnaise a besoin d'un site web en 2026 ?",
    metaTitle: "Pourquoi votre entreprise réunionnaise a besoin d'un site web en 2026 ?",
    metaDescription:
      "En 2026, ne pas avoir de site web c'est perdre des clients chaque jour. Voici 7 raisons concrètes pour lesquelles les entreprises réunionnaises doivent être présentes en ligne.",
    targetKeywords: [
      "site web entreprise réunion",
      "créer site web réunion",
      "présence en ligne réunion",
      "site internet 974",
      "pourquoi créer site web",
    ],
    excerpt:
      "87 % des Réunionnais cherchent un prestataire sur internet avant de le contacter. Sans site, vous n'existez pas. Voici pourquoi et comment y remédier.",
    readTime: 7,
    publishedAt: "2026-02-14",
    status: "published",
    priority: 3,
  },
  {
    slug: "facturation-electronique-2026-pme-reunionnaises",
    category: "guide-pratique",
    title: "Facturation électronique 2026 : guide complet pour les PME réunionnaises",
    metaTitle: "Facturation électronique 2026 : guide complet pour les PME réunionnaises",
    metaDescription:
      "La facturation électronique devient obligatoire en 2026 pour les PME françaises. Ce guide explique les étapes, les plateformes agréées et les solutions pour les entreprises à La Réunion.",
    targetKeywords: [
      "facturation électronique réunion 2026",
      "obligation facturation electronique PME",
      "e-facture réunion",
      "plateforme facturation electronique 974",
      "mise en conformité facturation réunion",
    ],
    excerpt:
      "Septembre 2026 : la facturation électronique devient obligatoire. Ce que ça change concrètement pour votre entreprise réunionnaise et comment vous y préparer.",
    readTime: 9,
    publishedAt: "2026-02-16",
    status: "published",
    priority: 4,
  },
  {
    slug: "application-mobile-ehpad-cliniques-reunion",
    category: "sante-numerique",
    title: "Application mobile pour EHPAD et cliniques à La Réunion : guide 2026",
    metaTitle: "Application mobile EHPAD et cliniques à La Réunion : guide 2026",
    metaDescription:
      "Tout ce que vous devez savoir pour digitaliser votre EHPAD ou clinique à La Réunion en 2026 : fonctionnalités clés, contraintes réglementaires HDS et RGPD, et budget.",
    targetKeywords: [
      "application mobile EHPAD réunion",
      "digitalisation clinique réunion",
      "logiciel santé réunion",
      "développement application santé 974",
      "hébergement HDS réunion",
    ],
    excerpt:
      "6 ans à développer des applications pour des EHPAD et hôpitaux. Ce que j'ai appris sur la digitalisation du secteur santé à La Réunion.",
    readTime: 8,
    publishedAt: "2026-02-18",
    status: "published",
    priority: 5,
  },
  {
    slug: "freelance-vs-agence-web-reunion",
    category: "guide-pratique",
    title: "Freelance vs agence web à La Réunion : que choisir en 2026 ?",
    metaTitle: "Freelance vs agence web à La Réunion : que choisir en 2026 ?",
    metaDescription:
      "Freelance ou agence web à La Réunion : avantages, inconvénients et critères de choix selon votre projet. Comparatif honnête pour bien décider.",
    targetKeywords: [
      "freelance vs agence web réunion",
      "développeur freelance réunion",
      "agence web réunion",
      "choisir développeur réunion",
      "prestataire web 974",
    ],
    excerpt:
      "Choisir entre un freelance et une agence web à La Réunion, ce n'est pas une question de budget. C'est une question de projet. Voici comment décider.",
    readTime: 7,
    publishedAt: "2026-02-20",
    status: "published",
    priority: 6,
  },
];

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): BlogArticle[] {
  return BLOG_ARTICLES.filter(
    (a) => a.category === categorySlug && a.status === "published",
  ).sort((a, b) => a.priority - b.priority);
}

export function getPublishedArticles(): BlogArticle[] {
  return BLOG_ARTICLES.filter((a) => a.status === "published").sort(
    (a, b) => a.priority - b.priority,
  );
}
