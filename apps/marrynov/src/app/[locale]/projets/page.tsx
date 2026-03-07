import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { ProjectsCTA } from "@/components/sections/ProjectsCTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio – Sites Web & Apps Mobile Réunion",
  description:
    "Portfolio de réalisations web et mobile à La Réunion (974) : sites vitrine, e-commerce, applications métier et apps mobiles iOS & Android. Développeur Nicolas MARRY.",
  keywords:
    "portfolio développeur réunion, réalisations web réunion, projets application mobile 974, exemples sites web réunion",
  alternates: {
    canonical: "https://www.marrynov.re/projets",
  },
  openGraph: {
    title: "Portfolio – Sites Web & Apps Mobile Réunion | MARRYNOV",
    description:
      "Réalisations web et mobile à La Réunion : sites vitrine, e-commerce, apps mobiles iOS & Android.",
    url: "https://www.marrynov.re/projets",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProjectGrid />
        <Testimonials />
        <ProjectsCTA />
      </main>
      <Footer />
    </>
  );
}
