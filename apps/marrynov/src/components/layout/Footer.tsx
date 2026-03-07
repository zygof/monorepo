import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-footer text-footer-text">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3">
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded">
                <Image
                  src="/icons/logo-triangle.svg"
                  alt="MARRYNOV logo"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </div>
              <span className="text-xl font-bold text-white">{nav("brand")}</span>
            </Link>
            <p className="text-light-muted mb-4 text-sm leading-relaxed">
              {t("description")}
            </p>
            <p className="text-footer-muted text-xs">{t("siret")}</p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">{t("navigation")}</h4>
            <ul className="space-y-3">
              {(["services", "about", "blog", "legal", "privacy"] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={
                      key === "services"
                        ? "/#services"
                        : key === "about"
                          ? "/a-propos"
                          : key === "blog"
                            ? "/blog"
                            : key === "legal"
                              ? "/mentions-legales"
                              : "/politique-confidentialite"
                    }
                    className="text-footer-text text-sm transition-colors hover:text-white"
                  >
                    {t(`links.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">{t("contactTitle")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="text-primary h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${t("email")}`}
                  className="text-sm transition-colors hover:text-white"
                >
                  {t("email")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary h-4 w-4 shrink-0" />
                <a
                  href={`tel:${t("phone")}`}
                  className="text-sm transition-colors hover:text-white"
                >
                  {t("phone")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="text-primary h-4 w-4 shrink-0" />
                <span className="text-sm">{t("location")}</span>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-footer-social hover:bg-primary flex h-10 w-10 items-center justify-center rounded transition-colors"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-footer-social hover:bg-primary flex h-10 w-10 items-center justify-center rounded transition-colors"
              >
                <Github className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-footer-social border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-footer-muted text-center text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
