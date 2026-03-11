import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { GtmProvider, GtmNoScript } from "@marrynov/monitoring/gtm";
import { ConsentBanner } from "@marrynov/monitoring/consent-banner";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      {GTM_ID && <GtmProvider gtmId={GTM_ID} />}
      <body className={`${inter.variable} font-sans antialiased`}>
        {GTM_ID && <GtmNoScript gtmId={GTM_ID} />}
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <ConsentBanner />
      </body>
    </html>
  );
}
