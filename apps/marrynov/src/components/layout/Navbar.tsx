import { Button } from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "./MobileMenu";

export async function Navbar() {
  const t = await getTranslations("nav");

  const links = [
    { href: "/#services", label: t("services") },
    { href: "/a-propos", label: t("about") },
    { href: "/blog", label: t("blog") },
  ];

  return (
    <header className="border-bg-light sticky top-0 z-50 border-b bg-white/90 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary relative flex h-10 w-10 items-center justify-center rounded-lg shadow-[0px_10px_15px_-3px_rgba(107,64,160,0.3),0px_4px_6px_-4px_rgba(107,64,160,0.3)]">
              <Image
                src="/icons/logo.svg"
                alt="MARRYNOV logo"
                width={18}
                height={18}
                priority
                className="h-4.5 w-4.5"
              />
            </div>
            <div>
              <span className="text-primary text-xl font-bold tracking-tight">
                {t("brand")}
              </span>
              <p className="text-muted hidden text-xs font-medium sm:block">
                {t("tagline")}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body hover:text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button
              href="/contact"
              size="sm"
              variant="accent"
              className="rounded-lg shadow-[0px_4px_6px_-1px_rgba(249,115,22,0.2),0px_2px_4px_-2px_rgba(249,115,22,0.2)]"
            >
              {t("contact")}
            </Button>
          </div>

          <MobileMenu links={links} contactLabel={t("contact")} />
        </div>
      </nav>
    </header>
  );
}
