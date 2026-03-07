import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import Image from "next/image";

function DeviceMockup() {
  return (
    <div className="relative">
      {/* Computer screen */}
      <Image
        src="/icons/device-desktop.svg"
        alt="Desktop mockup"
        width={526}
        height={378}
        priority
        className="w-full"
      />
      {/* Phone */}
      <Image
        src="/icons/device-phone.svg"
        alt="Phone mockup"
        width={238}
        height={374}
        priority
        className="absolute -right-3 bottom-0 w-37.5"
      />
    </div>
  );
}

export function Hero() {
  const t = useTranslations("hero");

  const titleRaw = t.raw("title") as string;
  const titleParts = titleRaw.split(/<highlight>(.*?)<\/highlight>/);

  return (
    <section className="bg-primary-light relative flex flex-1 items-center overflow-hidden px-8 py-12 lg:py-0">
      {/* Decorative blurred shapes */}
      <div
        className="bg-primary/10 animate-float-vertical pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full blur-[32px]"
        style={{ animationDuration: "8s", animationDelay: "0s", willChange: "transform" }}
      />
      <div
        className="bg-accent/10 animate-float-vertical pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-[32px]"
        style={{ animationDuration: "8s", animationDelay: "3s", willChange: "transform" }}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:flex-row lg:gap-20">
        {/* Left: Text content */}
        <div className="flex-1">
          <Badge className="border-primary/20 bg-primary/10 text-primary mb-6 border">
            <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
            <span className="text-xs font-semibold tracking-widest uppercase">
              {t("badge")}
            </span>
          </Badge>

          <h1 className="text-dark text-4xl leading-tight font-extrabold sm:text-5xl lg:text-[60px] lg:leading-15">
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
          </h1>

          <p className="text-body mt-6 max-w-2xl text-lg leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
            <Button
              href="/contact"
              variant="accent"
              size="lg"
              className="rounded-lg shadow-[0px_10px_15px_-3px_rgba(249,115,22,0.2),0px_4px_6px_-4px_rgba(249,115,22,0.2)]"
            >
              {t("cta_primary")}
            </Button>
          </div>
        </div>

        {/* Right: Device mockup */}
        <div className="hidden w-64 shrink-0 sm:w-80 lg:block lg:w-125">
          <DeviceMockup />
        </div>
      </div>
    </section>
  );
}
