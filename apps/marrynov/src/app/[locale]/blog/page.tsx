import { BlogCard } from "@/components/blog/BlogCard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BLOG_CATEGORIES, getArticlesByCategory, getPublishedArticles } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog – Conseils Web & Digital La Réunion | MARRYNOV",
  description:
    "Conseils, guides et actualités pour les entrepreneurs réunionnais : site web, applications mobiles, aide Kap Numérik et digitalisation des entreprises à La Réunion (974).",
  keywords:
    "blog développeur web réunion, conseils digital réunion, guide création site web 974, kap numérik prestataire, facturation électronique réunion",
  alternates: {
    canonical: "https://www.marrynov.re/blog",
  },
  openGraph: {
    title: "Blog – Conseils Web & Digital La Réunion | MARRYNOV",
    description:
      "Conseils, guides et actualités pour les entrepreneurs réunionnais qui veulent réussir leur transformation digitale.",
    url: "https://www.marrynov.re/blog",
  },
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const articles = category ? getArticlesByCategory(category) : getPublishedArticles();

  const activeCategory = BLOG_CATEGORIES.find((c) => c.slug === category);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-primary-light py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-dark text-3xl font-bold md:text-4xl">
                {activeCategory ? activeCategory.label : "Blog & Ressources"}
              </h1>
              <p className="text-body mx-auto mt-4 max-w-2xl text-lg">
                {activeCategory
                  ? activeCategory.description
                  : "Conseils, guides et ressources pour les entrepreneurs réunionnais qui veulent réussir leur transformation digitale."}
              </p>
            </div>
          </div>
        </section>

        {/* Category filter */}
        <div className="border-border bg-bg-white sticky top-20 z-40 border-b shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="scrollbar-none flex gap-2 overflow-x-auto py-3">
              <Link
                href="/blog"
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  !category
                    ? "bg-primary text-white"
                    : "bg-bg-light text-body hover:bg-primary-light hover:text-primary"
                }`}
              >
                Tous les articles
              </Link>
              {BLOG_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    category === cat.slug
                      ? "bg-primary text-white"
                      : "bg-bg-light text-body hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Articles grid */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {articles.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted">
                  Aucun article dans cette catégorie pour l'instant.
                </p>
                <Link
                  href="/blog"
                  className="text-primary mt-4 inline-block text-sm font-medium underline"
                >
                  Voir tous les articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <BlogCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-light py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-dark text-2xl font-bold md:text-3xl">
              Vous avez un projet digital à La Réunion ?
            </h2>
            <p className="text-body mx-auto mt-4 max-w-xl text-lg">
              Premier échange gratuit, réponse sous 24h.
            </p>
            <Link
              href="/contact"
              className="bg-accent hover:bg-accent-hover mt-8 inline-block rounded-full px-8 py-4 font-semibold text-white transition-colors"
            >
              Demander un devis gratuit
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
