import { SectionHeading } from "@/components/ui/SectionHeading";
import { Heart, Lightbulb, Shield, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [Users, Lightbulb, Shield, Heart];

export function Values() {
  const t = useTranslations("about.values");

  const items = [0, 1, 2, 3].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    Icon: icons[i]!,
  }));

  return (
    <section className="bg-bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div key={i} className="p-6 text-center">
              <div className="bg-primary-light mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
                <item.Icon className="text-primary h-7 w-7" />
              </div>
              <h3 className="text-dark text-xl font-bold">{item.title}</h3>
              <p className="text-body mt-3 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
