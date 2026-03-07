import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { BLOG_ARTICLES, getArticleBySlug, getCategoryBySlug } from "@/lib/blog";
import { BLOG_CONTENT } from "@/lib/blog-content";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return BLOG_ARTICLES.filter((a) => a.status === "published").map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.targetKeywords.join(", "),
    alternates: {
      canonical: `https://www.marrynov.re/blog/${slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://www.marrynov.re/blog/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.status !== "published") notFound();

  const category = getCategoryBySlug(article.category);
  const Content = BLOG_CONTENT[slug];

  if (!Content) notFound();

  const date = new Date(article.publishedAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.metaTitle,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      "@id": "https://www.marrynov.re/#nicolas",
      name: "Nicolas MARRY",
      url: "https://www.marrynov.re/a-propos",
    },
    publisher: {
      "@id": "https://www.marrynov.re/#business",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.marrynov.re/blog/${slug}`,
    },
    keywords: article.targetKeywords.join(", "),
    url: `https://www.marrynov.re/blog/${slug}`,
    inLanguage: "fr-FR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Article header */}
        <section className="bg-primary-light py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="text-primary mb-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au blog
            </Link>
            <div className="mb-4">
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                {category?.label}
              </span>
            </div>
            <h1 className="text-dark text-2xl leading-tight font-bold md:text-3xl lg:text-4xl">
              {article.title}
            </h1>
            <div className="text-muted mt-5 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime} min de lecture
              </span>
              <span>
                Par{" "}
                <Link
                  href="/a-propos"
                  className="text-dark hover:text-primary font-semibold"
                >
                  Nicolas MARRY
                </Link>
              </span>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Content />
          </div>
        </article>

        {/* Author card */}
        <div className="border-border bg-bg-white border-t py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="border-border flex items-start gap-4 rounded-2xl border p-6">
              <div className="bg-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white">
                N
              </div>
              <div>
                <p className="text-dark font-bold">Nicolas MARRY</p>
                <p className="text-muted text-sm">
                  Développeur web & mobile freelance à La Réunion — Fondateur de MARRYNOV.
                  12 ans d'expérience, dont 6 ans en santé numérique.
                </p>
                <Link
                  href="/a-propos"
                  className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
                >
                  En savoir plus →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="bg-primary-light py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-dark text-2xl font-bold md:text-3xl">
              Vous avez un projet digital à La Réunion ?
            </h2>
            <p className="text-body mx-auto mt-4 max-w-xl text-lg">
              Premier échange gratuit, réponse sous 24h. Éligible Kap Numérik (–3 200 €).
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
