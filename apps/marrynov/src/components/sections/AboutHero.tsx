import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function AboutHero() {
  const t = useTranslations("about.hero");
  const titleRaw = t.raw("bio2") as string;
  const titleParts = titleRaw.split(/<highlight>(.*?)<\/highlight>/);

  return (
    <section className="bg-bg-white flex min-h-[calc(100vh-5rem)] items-center py-12 md:py-0">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* Photo column - appears second on mobile, first on desktop */}
          <div className="relative mx-auto w-full max-w-md md:order-1 md:max-w-none">
            <div className="from-primary/20 to-primary-light flex aspect-4/5 items-end justify-center overflow-hidden rounded-2xl bg-linear-to-br">
              <div className="from-primary/30 flex h-full w-full items-center justify-center bg-linear-to-t to-transparent">
                <span className="text-primary/20 text-6xl font-bold">PHOTO</span>
              </div>
            </div>
            <Badge variant="default" className="absolute bottom-4 left-4 p-3 shadow-lg">
              {t("badge")}
            </Badge>
          </div>
          {/* Text column - appears first on mobile, second on desktop */}
          <div className="md:order-2">
            {/* Badge */}
            <div className="mb-4 hidden md:block">
              <span className="bg-accent/10 text-accent inline-block rounded-full px-3 py-1 text-xs font-semibold">
                {t("badge2")}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-dark-deep text-4xl font-bold md:text-5xl">
              Nicolas <span className="text-primary">MARRY</span>
            </h1>

            {/* Role */}
            <p className="text-muted mt-2 text-xl font-medium">{t("role")}</p>

            {/* Bio paragraphs */}
            <div className="mt-6 space-y-4">
              <p className="text-body leading-relaxed">{t("bio1")}</p>
              <p className="text-body leading-relaxed">
                {titleParts.map((part, i) =>
                  i % 2 === 1 ? (
                    <span
                      key={i}
                      className="from-primary bg-linear-to-r to-[#c084fc] bg-clip-text text-transparent"
                    >
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" variant="primary">
                {t("cta_primary")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
