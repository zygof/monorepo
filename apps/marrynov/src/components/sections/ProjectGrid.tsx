"use client";

import { FilterBar } from "@/components/ui/FilterBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ProjectGrid() {
  const t = useTranslations("projects");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { key: "all", label: t("filters.all") },
    { key: "web", label: t("filters.web") },
    { key: "business", label: t("filters.business") },
    { key: "mobile", label: t("filters.mobile") },
    { key: "health", label: t("filters.health") },
  ];

  const projects = [0, 1, 2, 3, 4, 5].map((i) => ({
    title: t(`items.${i}.title`),
    description: t(`items.${i}.description`),
    tags: Array.from({ length: 3 }, (_, j) => {
      try {
        return t(`items.${i}.tags.${j}`);
      } catch {
        return "";
      }
    }).filter((tag) => tag !== ""),
    type: t(`items.${i}.type`),
    badge: t(`items.${i}.badge`),
    categories: Array.from({ length: i === 0 || i === 1 ? 2 : 1 }, (_, j) =>
      t(`items.${i}.category.${j}`),
    ),
  }));

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter));

  return (
    <>
      <section className="bg-bg py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />
          <div className="mt-10">
            <FilterBar
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard
                key={i}
                title={project.title}
                description={project.description}
                tags={project.tags}
                type={project.type}
                badge={project.badge}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
