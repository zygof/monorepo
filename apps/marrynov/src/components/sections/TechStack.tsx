import { useTranslations } from "next-intl";

export function TechStack() {
  const t = useTranslations("about.techStack");

  const technologies = [
    "React",
    "React Native",
    "Node.js",
    "TypeScript",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "Docker",
  ];

  return (
    <section className="bg-primary-lighter py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-12 text-center">
          <h2 className="text-dark text-3xl font-bold md:text-4xl">{t("title")}</h2>
        </div>

        {/* Tech logos */}
        <div className="flex flex-wrap justify-center gap-4">
          {technologies.map((tech, i) => (
            <div
              key={i}
              className="bg-border/30 hover:bg-primary-light flex h-15 w-15 items-center justify-center rounded-xl grayscale transition-colors hover:grayscale-0"
            >
              <span className="text-muted hover:text-primary text-xs font-bold transition-colors">
                {tech.slice(0, 3).toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Small text below */}
        <div className="mt-8 text-center">
          <p className="text-muted text-sm italic">
            Et bien d'autres selon les besoins de votre projet.
          </p>
        </div>
      </div>
    </section>
  );
}
