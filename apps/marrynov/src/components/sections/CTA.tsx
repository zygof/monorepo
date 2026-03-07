import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, Shield, Sparkles, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function CTA() {
  const t = await getTranslations("cta");

  const trustSignals = [
    { icon: Star, text: "12+ ans d'expérience" },
    { icon: CheckCircle2, text: "100% de clients satisfaits" },
    { icon: Shield, text: "Code sécurisé & maintenable" },
  ];

  return (
    <section className="from-primary via-primary to-primary-dark relative overflow-hidden bg-linear-to-br py-24 md:py-32">
      {/* Animated background pattern */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[64px_64px] opacity-70" />
        <div className="animate-float from-primary-dark/30 absolute bottom-0 left-0 h-100 w-100 rounded-full bg-linear-to-br to-transparent blur-3xl [animation-delay:2s]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
          {/* Gradient overlay */}
          <div className="to-accent/5 absolute inset-0 bg-linear-to-br from-white/5 via-transparent" />

          <div className="relative px-6 py-12 sm:px-12 md:px-16 md:py-16">
            {/* Badge */}
            <div className="mb-6 flex justify-center">
              <div className="border-accent/30 bg-accent/10 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm">
                <Sparkles className="text-accent h-4 w-4" />
                <span className="text-sm font-semibold text-white">
                  Premier appel découverte offert — 30 minutes
                </span>
              </div>
            </div>

            {/* Main content */}
            <div className="text-center">
              <h2 className="text-3xl leading-tight font-extrabold text-white md:text-5xl lg:text-6xl">
                {t("title")}
                <div>{t("title2")}</div>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
                {t("subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                <Button
                  href="/contact"
                  variant="accent"
                  size="lg"
                  className="group relative overflow-hidden rounded-xl px-8 py-4 text-base font-bold shadow-[0px_20px_50px_-10px_rgba(249,115,22,0.5)] transition-all hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("button")}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />
                </Button>
              </div>

              {/* Trust signals */}
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                {trustSignals.map((signal, i) => {
                  const Icon = signal.icon;
                  return (
                    <div
                      key={i}
                      className="hover:border-accent/30 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/10"
                    >
                      <Icon className="text-accent h-5 w-5 shrink-0" />
                      <span className="text-sm font-medium text-white/90">
                        {signal.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="border-accent/20 pointer-events-none absolute top-0 left-0 h-32 w-32 rounded-tl-3xl border-t-2 border-l-2" />
          <div className="border-accent/20 pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-br-3xl border-r-2 border-b-2" />
        </div>

        {/* Bottom reassurance */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            ✓ Devis gratuit et sans engagement ✓ Réponse sous 24h ✓ Basé à La Réunion
          </p>
        </div>
      </div>
    </section>
  );
}
