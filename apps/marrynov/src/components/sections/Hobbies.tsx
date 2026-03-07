import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";

export function Hobbies() {
  const t = useTranslations("about.hobbies");

  const hobbies = [
    { emoji: "🏸", title: t("items.0.title"), description: t("items.0.description") },
    { emoji: "🎶", title: t("items.1.title"), description: t("items.1.description") },
    { emoji: "📚", title: t("items.2.title"), description: t("items.2.description") },
  ];

  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {hobbies.map((hobby, i) => (
            <div key={i} className="bg-bg-white rounded-xl p-6 text-center">
              <div className="mb-4 text-4xl">{hobby.emoji}</div>
              <h3 className="text-dark text-lg font-bold">{hobby.title}</h3>
              <p className="text-body mt-2 text-sm leading-relaxed">
                {hobby.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
