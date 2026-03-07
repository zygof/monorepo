import { getCategoryBySlug, type BlogArticle } from "@/lib/blog";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

type BlogCardProps = {
  article: BlogArticle;
};

export function BlogCard({ article }: BlogCardProps) {
  const category = getCategoryBySlug(article.category);
  const date = new Date(article.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group border-border bg-bg-white flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
          {category?.label}
        </span>
        {article.priority === 1 && (
          <span className="bg-accent/10 text-accent rounded-full px-3 py-1 text-xs font-medium">
            À lire en premier
          </span>
        )}
      </div>

      <h2 className="text-dark group-hover:text-primary mb-2 flex-1 text-lg leading-snug font-bold transition-colors">
        {article.title}
      </h2>

      <p className="text-body mb-4 line-clamp-3 text-sm leading-relaxed">
        {article.excerpt}
      </p>

      <div className="text-muted flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {article.readTime} min de lecture
        </span>
      </div>
    </Link>
  );
}
