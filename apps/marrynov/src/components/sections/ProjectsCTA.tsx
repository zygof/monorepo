import { useTranslations } from "next-intl";
import Link from "next/link";

export function ProjectsCTA() {
  const t = useTranslations("projects");

  return (
    <section className="from-primary via-primary to-primary-dark relative overflow-hidden bg-gradient-to-br py-20 md:py-28">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-5xl">{t("ctaTitle")}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
          {t("ctaSubtitle")}
        </p>
        <div className="mt-10">
          <Link
            href="/contact"
            className="bg-accent hover:bg-accent-hover inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}
