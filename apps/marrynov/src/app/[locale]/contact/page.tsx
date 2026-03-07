import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis Gratuit – Développeur Web Réunion",
  description:
    "Demandez un devis gratuit pour votre site web ou application mobile à La Réunion. Réponse sous 24h. Développeur freelance à Saint-Denis, éligible Kap Numérik (–3 200 €).",
  keywords:
    "devis site web réunion, devis application mobile réunion, contact développeur réunion, développeur web 974",
  alternates: {
    canonical: "https://www.marrynov.re/contact",
  },
  openGraph: {
    title: "Devis Gratuit – Développeur Web Réunion | MARRYNOV",
    description:
      "Devis gratuit pour votre site web ou application mobile à La Réunion. Réponse sous 24h. Éligible Kap Numérik.",
    url: "https://www.marrynov.re/contact",
  },
};

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-primary-light py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-dark text-3xl font-bold md:text-4xl">{t("title")}</h1>
              <p className="text-body mx-auto mt-4 max-w-3xl text-lg leading-relaxed font-normal">
                {t("subtitle")}
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
              <div className="lg:col-span-2">
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
