import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function AboutCTA() {
  const t = useTranslations("about.cta");

  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white md:text-4xl">{t("title")}</h2>
        <p className="mt-4 text-lg text-white/80">{t("subtitle")}</p>
        <div className="mt-8">
          <Button href="/contact" variant="accent" size="lg">
            {t("button")}
          </Button>
        </div>
      </div>
    </section>
  );
}
