import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marrynov.re"),
  title: {
    template: "%s | MARRYNOV",
    default: "MARRYNOV – Développeur Web & Mobile à La Réunion",
  },
  description:
    "Développeur Fullstack Web & Mobile à La Réunion. Création de sites web et applications sur-mesure. Éligible Kap Numerik.",
  openGraph: {
    siteName: "MARRYNOV",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
