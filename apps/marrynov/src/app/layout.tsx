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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MARRYNOV — Développeur Web & Mobile à La Réunion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
