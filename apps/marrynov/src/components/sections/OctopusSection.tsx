import { useTranslations } from "next-intl";

export function OctopusSection() {
  const t = useTranslations("about.octopus");

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left column - Text */}
          <div className="lg:col-span-7">
            <h2 className="text-dark text-3xl font-bold md:text-4xl">
              <span className="mr-2">🐙</span>
              {t("title")}
            </h2>
            <p className="text-body mt-6 text-lg leading-relaxed">{t("description")}</p>
          </div>

          {/* Right column - Illustration */}
          <div className="lg:col-span-5">
            <div className="from-primary/10 to-primary/5 flex aspect-square items-center justify-center rounded-2xl bg-linear-to-br">
              {/* Geometric octopus placeholder */}
              <svg className="h-64 w-64" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="80" r="40" fill="#6b40a0" opacity="0.2" />
                <circle cx="100" cy="80" r="30" fill="#6b40a0" opacity="0.4" />
                <circle cx="100" cy="80" r="20" fill="#6b40a0" />
                {/* Tentacles */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 100 + Math.cos(rad) * 30;
                  const y1 = 80 + Math.sin(rad) * 30;
                  const x2 = 100 + Math.cos(rad) * 70;
                  const y2 = 80 + Math.sin(rad) * 70;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#8e5ec2"
                      strokeWidth="4"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
