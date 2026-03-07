import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CTA } from "@/components/sections/CTA";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { TrustBar } from "@/components/sections/TrustBar";
import { WhyMe } from "@/components/sections/WhyMe";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Développeur Web & Mobile La Réunion (974) | MARRYNOV",
  description:
    "Développeur web freelance à La Réunion (974) — création de sites web, applications mobiles et solutions métiers sur-mesure à Saint-Denis. Éligible Kap Numérik (–3 200 €). Devis gratuit sous 24h.",
  keywords:
    "développeur web réunion, développeur web 974, création site web réunion, site vitrine réunion, application mobile réunion, développeur freelance réunion, développeur fullstack réunion, développeur saint-denis réunion, kap numérik, agence web réunion, création application mobile 974",
  alternates: {
    canonical: "https://www.marrynov.re",
  },
  openGraph: {
    title: "Développeur Web & Mobile La Réunion (974) | MARRYNOV",
    description:
      "Création de sites web et applications mobiles sur-mesure à La Réunion. Éligible Kap Numérik (–3 200 €). Devis gratuit sous 24h.",
    url: "https://www.marrynov.re",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": "https://www.marrynov.re/#business",
      name: "MARRYNOV",
      description:
        "Développeur web et mobile freelance à La Réunion (974). Création de sites web, applications mobiles et solutions métiers sur-mesure à Saint-Denis.",
      url: "https://www.marrynov.re",
      logo: "https://www.marrynov.re/icons/logo.svg",
      image: "https://www.marrynov.re/icons/logo.svg",
      telephone: "+262692400066",
      email: "contact@marrynov.re",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Saint-Denis",
        addressRegion: "La Réunion",
        postalCode: "97400",
        addressCountry: "FR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -20.8789,
        longitude: 55.4481,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      areaServed: { "@type": "Place", name: "La Réunion" },
      priceRange: "€€",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services de développement web et mobile à La Réunion",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Création de site vitrine",
              description:
                "Site web professionnel et responsive pour artisans et PME réunionnaises.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Application mobile iOS et Android",
              description: "Application mobile native développée à La Réunion.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Application métier sur-mesure",
              description: "Solutions métiers et dashboards personnalisés.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Facturation électronique 2026",
              description:
                "Mise en conformité obligatoire à la facturation électronique.",
            },
          },
        ],
      },
      founder: {
        "@type": "Person",
        "@id": "https://www.marrynov.re/#nicolas",
        name: "Nicolas MARRY",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.marrynov.re/#website",
      url: "https://www.marrynov.re",
      name: "MARRYNOV",
      description: "Développeur web et mobile freelance à La Réunion",
      publisher: { "@id": "https://www.marrynov.re/#business" },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <div className="flex min-h-[calc(100svh-5rem)] flex-col">
          <Hero />
          <TrustBar />
        </div>
        <Services />
        <Process />
        <WhyMe />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
