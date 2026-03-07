import { useTranslations } from "next-intl";
import Image from "next/image";

const icons = [
  "/icons/trust-experience.svg",
  "/icons/trust-health.svg",
  "/icons/trust-webapp.svg",
  "/icons/trust-location.svg",
];

export function TrustBar() {
  const t = useTranslations("trustBar");

  const items = [0, 1, 2, 3].map((i) => ({
    value: t(`items.${i}.value`),
    label: t(`items.${i}.label`),
    icon: icons[i] as string,
  }));

  return (
    <section className="border-bg-light shrink-0 border-y-2 bg-white py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-around md:gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <Image
                src={item.icon}
                alt={item.label}
                width={38}
                height={38}
                className="h-8 w-8 lg:h-9 lg:w-9"
              />
              <div>
                <p className="text-dark text-base font-bold lg:text-lg">{item.value}</p>
                <p className="text-muted text-[10px] font-medium tracking-wide uppercase lg:text-xs">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
