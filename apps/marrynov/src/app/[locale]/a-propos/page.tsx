import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutHero } from "@/components/sections/AboutHero";
import { Timeline } from "@/components/sections/Timeline";
import { Values } from "@/components/sections/Values";
import { Hobbies } from "@/components/sections/Hobbies";
import { CTA } from "@/components/sections/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nicolas MARRY – Développeur Freelance La Réunion",
  description:
    "Nicolas MARRY, développeur fullstack freelance à Saint-Denis, La Réunion (974). 12 ans d'expérience en développement web, mobile et santé numérique. Disponible pour votre projet.",
  keywords:
    "Nicolas MARRY développeur, développeur freelance réunion, développeur fullstack saint-denis, développeur web 974, freelance web réunion",
  alternates: {
    canonical: "https://www.marrynov.re/a-propos",
  },
  openGraph: {
    title: "Nicolas MARRY – Développeur Freelance La Réunion | MARRYNOV",
    description:
      "Développeur fullstack basé à Saint-Denis, La Réunion. 12 ans d'expérience web, mobile et santé numérique. Disponible pour votre projet.",
    url: "https://www.marrynov.re/a-propos",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.marrynov.re/#nicolas",
  name: "Nicolas MARRY",
  givenName: "Nicolas",
  familyName: "MARRY",
  jobTitle: "Développeur Fullstack Web & Mobile",
  description:
    "Développeur freelance basé à La Réunion avec 12 ans d'expérience en développement web et mobile, spécialiste santé numérique.",
  url: "https://www.marrynov.re/a-propos",
  worksFor: { "@id": "https://www.marrynov.re/#business" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Saint-Denis",
    addressRegion: "La Réunion",
    addressCountry: "FR",
  },
  knowsAbout: [
    "React",
    "Node.js",
    "TypeScript",
    "React Native",
    "Next.js",
    "Développement web",
    "Applications mobiles",
    "Santé numérique",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "YNOV Bordeaux",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <AboutHero />
        <Timeline />
        <Values />
        <Hobbies />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
