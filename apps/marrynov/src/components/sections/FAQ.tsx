import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useTranslations } from "next-intl";

export function FAQ() {
  const t = useTranslations("faq");

  const items = [0, 1, 2, 3, 4, 5].map((i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));

  return (
    <section className="bg-bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("title")} />
        <div className="mt-12">
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
