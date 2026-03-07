"use client";

import { Copy, ExternalLink } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  type: string;
  badge?: string;
};

export function ProjectCard({ title, description, tags, type, badge }: ProjectCardProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href + "#" + title.toLowerCase());
  };

  const getTypeColor = () => {
    switch (type) {
      case "Professionnel":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Projet école":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Personnel":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-primary group-hover:text-primary-dark text-xl font-bold transition-colors">
            {title}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-muted hover:text-primary hover:bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              aria-label="Copier le lien"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              className="text-muted hover:text-primary hover:bg-primary-light flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              aria-label="Partager"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getTypeColor()}`}
          >
            {type}
          </span>
        </div>

        <p className="text-body mb-6 text-sm leading-relaxed">{description}</p>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-primary/5 text-primary rounded-lg px-3 py-1 text-xs font-medium tracking-wide uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          {badge && (
            <div>
              <span className="bg-primary inline-block rounded-lg px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                {badge}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
