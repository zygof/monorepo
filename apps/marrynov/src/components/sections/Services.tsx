import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BarChart2, Bell, CheckCircle, FileText, Link2, Mail, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Services() {
  const t = useTranslations("services");
  const tContact = useTranslations("contact");

  const packs = [0, 1, 2].map((i) => ({
    name: t(`packs.${i}.name`),
    description: t(`packs.${i}.description`),
    price: t(`packs.${i}.price`),
    unit: t(`packs.${i}.unit`),
    badge: i === 1 ? t(`packs.${i}.badge`) : null,
    features: Array.from({ length: i === 0 ? 4 : i === 1 ? 5 : 4 }, (_, j) =>
      t(`packs.${i}.features.${j}`),
    ),
    cta: t(`packs.${i}.cta`),
    highlighted: i === 1,
  }));

  const businessSolutions = [0, 1].map((i) => ({
    name: t(`businessSolutions.solutions.${i}.name`),
    description: t(`businessSolutions.solutions.${i}.description`),
    price: t(`businessSolutions.solutions.${i}.price`),
    unit: t(`businessSolutions.solutions.${i}.unit`),
    badge: i === 0 ? t(`businessSolutions.solutions.${i}.badge`) : null,
    features: Array.from({ length: 4 }, (_, j) =>
      t(`businessSolutions.solutions.${i}.features.${j}`),
    ),
    cta: t(`businessSolutions.solutions.${i}.cta`),
    highlighted: false,
  }));

  return (
    <section id="services" className="relative bg-white py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="relative mt-16 grid grid-cols-1 items-start gap-4 md:grid-cols-3 md:gap-0 lg:gap-8">
          {packs.map((pack, i) => (
            <div
              key={i}
              className={`flex flex-col gap-2 rounded-xl p-8 ${
                pack.highlighted
                  ? "border-primary relative z-10 border-2 bg-white shadow-[0px_10px_30px_-5px_rgba(107,63,160,0.08)]"
                  : "border-bg-light bg-bg-light border shadow-sm"
              }`}
            >
              {pack.badge && (
                <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                  {pack.badge}
                </span>
              )}

              <h3 className="text-dark text-xl font-bold">{pack.name}</h3>
              <p className="text-muted text-sm">{pack.description}</p>

              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-dark font-extrabold ${pack.highlighted ? "text-4xl" : "text-3xl"}`}
                >
                  {pack.price}
                </span>
                <span className="text-muted text-sm">{pack.unit}</span>
              </div>

              <ul className="border-border mt-4 flex-1 space-y-4 border-t pt-4">
                {pack.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        pack.highlighted ? "text-primary" : "text-success"
                      }`}
                    />
                    <span className="text-body text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                href="/contact"
                variant={pack.highlighted ? "accent" : "accentOutline"}
                className={`mt-6 w-full rounded-lg ${
                  pack.highlighted
                    ? "shadow-accent shadow-2xl"
                    : "border-accent text-accent hover:bg-accent hover:text-white"
                }`}
              >
                {pack.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Business Solutions Section */}
        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-dark text-3xl font-bold md:text-4xl">
              {t("businessSolutions.title")}
            </h2>
            <p className="text-muted mx-auto mt-4 max-w-2xl text-lg">
              {t("businessSolutions.subtitle")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {businessSolutions.map((solution, i) => (
              <div
                key={i}
                className={`relative flex flex-col gap-2 rounded-xl border p-8 shadow-sm ${
                  solution.badge
                    ? "border-primary border-2 bg-white"
                    : "border-border bg-bg-light"
                }`}
              >
                {solution.badge && (
                  <span className="bg-primary absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                    {solution.badge}
                  </span>
                )}

                <h3 className="text-dark text-xl font-bold">{solution.name}</h3>
                <p className="text-muted text-sm">{solution.description}</p>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-dark text-3xl font-extrabold">
                    {solution.price}
                  </span>
                  {solution.unit && (
                    <span className="text-muted text-sm">{solution.unit}</span>
                  )}
                </div>

                <ul className="border-border mt-4 flex-1 space-y-4 border-t pt-4">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="text-success mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-body text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/contact"
                  variant="accentOutline"
                  className="border-accent text-accent hover:bg-accent mt-6 w-full rounded-lg hover:text-white"
                >
                  {solution.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Showcase */}
        <div className="mt-20">
          <div className="text-center">
            <span className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
              Automatisation
            </span>
            <h2 className="text-dark text-3xl font-bold md:text-4xl">
              {t("automationShowcase.title")}
            </h2>
            <p className="text-muted mx-auto mt-4 max-w-2xl text-lg">
              {t("automationShowcase.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[Mail, FileText, Link2, BarChart2, Users, Bell].map((Icon, i) => (
              <div
                key={i}
                className="border-border bg-bg-light flex gap-4 rounded-xl border p-5 transition-shadow hover:shadow-md"
              >
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-dark text-sm font-semibold">
                    {t(`automationShowcase.useCases.${i}.title`)}
                  </h3>
                  <p className="text-muted mt-0.5 text-sm">
                    {t(`automationShowcase.useCases.${i}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kap Numerik Floating Badge */}
      <a
        href="https://www.kap-numerik.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent fixed right-6 bottom-6 z-20 hidden rounded-xl p-3 shadow-lg transition-all hover:scale-105 hover:shadow-xl md:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <Image
              src="/icons/kap-numerik.svg"
              alt="Kap Numerik"
              width={16}
              height={16}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              {tContact("kapNumerik.title")}
            </p>
            <p className="text-xl font-bold text-white">
              {tContact("kapNumerik.amount")}
            </p>
          </div>
        </div>
      </a>
    </section>
  );
}
