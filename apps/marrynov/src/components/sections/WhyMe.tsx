import { useTranslations } from "next-intl";
import Image from "next/image";

const icons = [
  "/icons/why-unique.svg",
  "/icons/why-code.svg",
  "/icons/why-health.svg",
  "/icons/why-local.svg",
];

export function WhyMe() {
  const t = useTranslations("whyMe");

  const benefits = [0, 1, 2, 3].map((i) => ({
    title: t(`benefits.${i}.title`),
    description: t(`benefits.${i}.description`),
    icon: icons[i] as string,
  }));

  return (
    <section className="bg-primary-light py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-16">
          {/* Left: Benefits Grid */}
          <div className="flex-1">
            <h2 className="text-dark text-4xl font-bold">{t("title")}</h2>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {benefits.map((benefit, i) => (
                <div key={i} className="rounded-lg p-4">
                  <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                    <Image
                      src={benefit.icon}
                      alt={benefit.title}
                      width={16}
                      height={16}
                      loading="lazy"
                      className="h-6 w-6"
                    />
                  </div>
                  <h3 className="text-dark text-lg font-bold">{benefit.title}</h3>
                  <p className="text-body mt-2 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo Placeholder */}
          <div className="hidden w-96 shrink-0 lg:block">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-2xl">
              <div className="from-light-muted to-muted absolute inset-0 bg-linear-to-br" />
              <div className="from-dark/80 absolute inset-0 bg-linear-to-t to-transparent" />
              <div className="absolute right-6 bottom-6 left-6">
                <div className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <p className="text-sm leading-relaxed font-medium text-white">
                    &ldquo;{t("quote")}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
