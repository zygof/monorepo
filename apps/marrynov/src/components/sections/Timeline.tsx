import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Timeline() {
  const t = useTranslations("about.timeline");

  const events = [0, 1, 2, 3].map((i) => ({
    year: t(`events.${i}.year`),
    title: t(`events.${i}.title`),
    description: t(`events.${i}.description`),
  }));

  return (
    <section id="timeline" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} />
        <div className="relative mt-12">
          <div className="bg-border absolute top-0 bottom-0 left-6 w-0.5" />
          <div className="space-y-10">
            {events.map((event, i) => (
              <div key={i} className="relative pl-16">
                <div className="bg-primary absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white">
                  {event.year}
                </div>
                <div className="bg-bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-dark text-lg font-bold">{event.title}</h3>
                  <p className="text-body mt-2 text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
