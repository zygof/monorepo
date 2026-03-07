import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";
import Image from "next/image";

const icons = [
  "/icons/process-discovery.svg",
  "/icons/process-proposal.svg",
  "/icons/process-signature.svg",
  "/icons/process-dev.svg",
  "/icons/process-delivery.svg",
];

export function Process() {
  const t = useTranslations("process");

  const steps = [0, 1, 2, 3, 4].map((i) => ({
    number: t(`steps.${i}.number`),
    title: t(`steps.${i}.title`),
    description: t(`steps.${i}.description`),
    icon: icons[i] as string,
  }));

  return (
    <section className="border-bg-light border-t-2 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="bg-border absolute top-8 right-0 left-0 hidden h-0.5 lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div
                  className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] ${
                    i === 0 ? "border-accent-hover" : "border-primary"
                  }`}
                >
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={30}
                    height={30}
                    loading="lazy"
                    className="h-6 w-6"
                  />
                </div>
                <h3 className="text-dark-deep mt-5 text-lg font-bold">
                  {step.number}. {step.title}
                </h3>
                <p className="text-muted mt-2 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
