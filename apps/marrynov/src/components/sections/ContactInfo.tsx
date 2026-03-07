import { Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function ContactInfo() {
  const t = useTranslations("contact");

  const details = [
    {
      icon: "/icons/location.svg",
      label: t("info.location.label"),
      value: t("info.location.value"),
    },
    {
      icon: "/icons/email.svg",
      label: t("info.email.label"),
      value: t("info.email.value"),
      href: `mailto:${t("info.email.value")}`,
    },
    {
      icon: "/icons/phone.svg",
      label: t("info.phone.label"),
      value: t("info.phone.value"),
      href: `tel:${t("info.phone.value")}`,
    },
    {
      icon: "/icons/clock.svg",
      label: t("info.availability.label"),
      value: t("info.availability.value"),
    },
  ];

  return (
    <div className="space-y-7">
      <div className="bg-bg-white relative overflow-hidden rounded-2xl p-5 shadow-sm">
        {/* Decorative gradient element */}
        <div className="from-accent/15 to-accent/5 absolute -top-16 -right-16 h-32 w-32 rounded-full bg-linear-to-bl" />

        <h2 className="text-dark relative mb-6 text-lg font-semibold">
          {t("info.title")}
        </h2>
        <div className="relative space-y-5">
          {details.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="bg-accent/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="h-4.5 w-4.5"
                />
              </div>
              <div>
                <p className="text-muted text-sm font-medium">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-dark hover:text-primary text-sm transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-dark text-sm">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="border-border mt-6 border-t pt-6">
          <p className="text-muted mb-3 text-sm font-medium">{t("info.socials")}</p>
          <div className="flex gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              className="bg-muted rounded-lg p-2.5 hover:opacity-70"
            >
              <Linkedin className="h-5 w-5 text-white" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              className="bg-muted rounded-lg p-2.5 hover:opacity-70"
            >
              <Github className="h-5 w-5 text-white" />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-accent rounded-2xl p-6 shadow-sm transition-opacity hover:opacity-70">
        <a href="https://www.kap-numerik.com/" target="_blank">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <Image
                src="/icons/kap-numerik.svg"
                alt="Kap Numerik"
                width={20}
                height={20}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t("kapNumerik.title")}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/90">
                {t("kapNumerik.description")}
              </p>
              <p className="mt-4">
                <span className="text-3xl font-bold text-white">
                  {t("kapNumerik.amount")}
                </span>
                <span className="ml-2 text-sm text-white/80">
                  {t("kapNumerik.amountLabel")}
                </span>
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
