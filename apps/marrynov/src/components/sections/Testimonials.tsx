import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  const t = useTranslations("projects.testimonials");

  const testimonials = [0, 1].map((i) => ({
    text: t(`items.${i}.text`),
    author: t(`items.${i}.author`),
    role: t(`items.${i}.role`),
  }));

  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} />
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((item, i) => (
            <div key={i} className="relative rounded-2xl bg-white p-8 shadow-sm">
              <div className="text-primary/10 mb-6 font-serif text-8xl leading-none">
                &ldquo;
              </div>
              <p className="text-body mb-8 leading-relaxed">{item.text}</p>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="text-primary text-lg font-bold">
                    {item.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-dark font-bold">{item.author}</p>
                  <p className="text-muted text-sm">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
