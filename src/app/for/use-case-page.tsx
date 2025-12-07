import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FadingHeroTitle } from "@/components/breathe/fading-hero-title";
import Resonance from "@/components/resonance/Resonance";
import { BREATHING_PATTERNS } from "@/components/resonance/constants";
import { JsonLd } from "@/components/seo/json-ld";
import { useCasePageMap, type UseCasePageContent } from "@/data/use-case-pages";

const baseUrl = "https://deepbreathingexercises.com";

export function createUseCaseMetadata(slug: string): Metadata {
  const page = useCasePageMap[slug];
  if (!page) return {};

  const pageContent: UseCasePageContent = page;
  const canonicalUrl = `${baseUrl}/for/${pageContent.slug}`;

  return {
    metadataBase: new URL(baseUrl),
    title: pageContent.meta.title,
    description: pageContent.meta.description,
    keywords: pageContent.keywords,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: "article",
      title: pageContent.meta.ogTitle || pageContent.meta.title,
      description: pageContent.meta.ogDescription || pageContent.meta.description,
      url: canonicalUrl
    },
    twitter: {
      card: "summary_large_image",
      title: pageContent.meta.twitterTitle || pageContent.meta.title,
      description: pageContent.meta.twitterDescription || pageContent.meta.description
    }
  };
}

export function UseCasePage({ slug }: { slug: string }) {
  const page = useCasePageMap[slug];
  if (!page) {
    notFound();
  }

  const pattern = BREATHING_PATTERNS[page.mode];
  const canonicalUrl = `${baseUrl}/for/${page.slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.hero.title,
    description: page.hero.intro,
    step: page.howTo.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.instruction,
      url: `${canonicalUrl}#how-to`
    }))
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.meta.title,
    description: page.meta.description,
    author: page.meta.author
      ? {
          "@type": "Person",
          name: page.meta.author
        }
      : undefined,
    datePublished: page.meta.datePublished,
    dateModified: page.meta.dateModified,
    mainEntityOfPage: canonicalUrl,
    keywords: page.keywords.join(", ")
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Use Cases",
        item: `${baseUrl}/for`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.hero.title
      }
    ]
  };

  const structuredData = [faqSchema, howToSchema, articleSchema, breadcrumbSchema];

  const heroHeader = (
    <div className="space-y-4">
      <FadingHeroTitle
        label="DEEP BREATHING EXERCISES"
        title={page.hero.title}
        subtitle={page.hero.subtitle}
      />
    </div>
  );

  return (
    <main className="bg-transparent">
      <JsonLd data={structuredData} />

      {/* Hero with Visualizer */}
      <section id="practice" className="relative isolate min-h-screen w-full text-foreground">
        <Resonance defaultMode={page.mode} className="min-h-screen" />
        <div className="absolute inset-y-0 left-0 z-30 hidden w-full max-w-xl px-6 py-20 lg:flex lg:flex-col lg:justify-center">
          {heroHeader}
        </div>
      </section>

      {/* Mobile Hero */}
      <section className="px-4 py-10 sm:px-6 lg:hidden lg:px-8">
        {heroHeader}
      </section>

      {/* Main Content */}
      <section className="relative z-10 mx-auto mt-6 w-full max-w-6xl space-y-12 rounded-t-[48px] bg-background/95 px-4 pb-20 pt-16 backdrop-blur-sm sm:px-6 lg:px-8">

        {/* Intro */}
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-xl leading-relaxed">{page.hero.intro}</p>
        </div>

        {/* Medical Disclaimer (if present) */}
        {page.disclaimer && (
          <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-500/10 p-6">
            <p className="font-medium text-amber-700 dark:text-amber-400">
              Important
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{page.disclaimer}</p>
          </div>
        )}

        {/* The Problem */}
        <section className="glow-card rounded-[32px] border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm uppercase tracking-widest text-primary">The Problem</p>
          <h2 className="mt-2 text-2xl font-semibold">{page.problem.heading}</h2>
          <p className="mt-4 text-muted-foreground">{page.problem.content}</p>

          {page.problem.symptoms && page.problem.symptoms.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Common symptoms</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {page.problem.symptoms.map((symptom) => (
                  <li key={symptom} className="flex items-start gap-2 text-sm text-card-foreground">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* The Solution */}
        <section className="glow-card rounded-[32px] border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm uppercase tracking-widest text-primary">The Solution</p>
          <h2 className="mt-2 text-2xl font-semibold">{page.solution.heading}</h2>
          <p className="mt-4 text-muted-foreground">{page.solution.content}</p>

          <div className="mt-6 rounded-2xl bg-muted/70 p-4">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Why this technique</p>
            <p className="mt-2 text-card-foreground">{page.solution.whyThisPattern}</p>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="#practice"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: pattern.color }}
            >
              Start practicing now →
            </a>
            <Link
              href={`/breathe/${page.relatedTechnique.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium transition hover:underline"
              style={{ color: pattern.color }}
            >
              Learn more about {pattern.name} Breathing →
            </Link>
          </div>
        </section>

        {/* Why It Works (Science) */}
        <section className="glow-card rounded-[32px] border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm uppercase tracking-widest text-primary">Why It Works</p>
          <h2 className="mt-2 text-2xl font-semibold">{page.science.heading}</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {page.science.points.map((point) => (
              <div key={point.mechanism} className="rounded-2xl bg-muted/70 p-4">
                <p className="font-semibold text-card-foreground">{point.mechanism}</p>
                <p className="mt-2 text-sm text-muted-foreground">{point.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How-To Steps */}
        <section id="how-to" className="glow-card rounded-[32px] border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm uppercase tracking-widest text-primary">Step-by-Step</p>
          <h2 className="mt-2 text-2xl font-semibold">How to Practice</h2>

          <ol className="mt-6 space-y-4">
            {page.howTo.steps.map((step, index) => (
              <li key={step.name} className="flex gap-4 rounded-2xl bg-muted/70 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-card-foreground">{step.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.instruction}</p>
                  {step.timing && (
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {step.timing}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {page.howTo.tips.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Pro tips</p>
              <ul className="mt-3 space-y-2">
                {page.howTo.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-card-foreground">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* References */}
        <section className="glow-card rounded-[32px] border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm uppercase tracking-widest text-primary">Research & References</p>
          <h2 className="mt-2 text-2xl font-semibold">Scientific Sources</h2>

          <ul className="mt-6 space-y-4">
            {page.references.map((ref) => (
              <li key={ref.url} className="rounded-2xl bg-muted/70 p-4">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  {ref.title}
                </a>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {ref.source}
                </p>
                {ref.summary && (
                  <p className="mt-2 text-sm text-muted-foreground">{ref.summary}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section id="faq" className="glow-card rounded-[32px] border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-2 text-2xl font-semibold">Common Questions</h2>

          <div className="mt-6 space-y-3">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl bg-muted p-4">
                <summary className="cursor-pointer text-lg font-medium text-foreground">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Use Cases */}
        {page.relatedUseCases.length > 0 && (
          <section className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-primary">More Breathing Guides</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.relatedUseCases.map((related) => {
                const relatedPage = useCasePageMap[related.slug];
                const relatedPattern = relatedPage ? BREATHING_PATTERNS[relatedPage.mode] : null;

                return (
                  <Link
                    key={related.slug}
                    href={`/for/${related.slug}`}
                    className="group rounded-[28px] border bg-card p-5 transition hover:border-primary"
                    style={{ borderColor: relatedPattern ? `${relatedPattern.color}40` : undefined }}
                  >
                    <p className="text-lg font-semibold text-card-foreground">
                      {relatedPage?.hero.title ?? related.slug}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{related.teaser}</p>
                    <span
                      className="mt-3 inline-flex items-center text-sm font-semibold text-primary"
                      style={{ color: relatedPattern?.color }}
                    >
                      Learn more →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Ready to practice */}
        <section className="rounded-[32px] p-8 text-center" style={{ backgroundColor: `${pattern.color}10` }}>
          <p className="text-sm uppercase tracking-widest" style={{ color: pattern.color }}>
            Ready to practice?
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-card-foreground">
            Start Your Session
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Use the interactive visualizer above to guide your breathing. Follow the animation and let your body relax.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="#practice"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: pattern.color }}
            >
              Go to visualizer →
            </a>
            <Link
              href={`/breathe/${page.relatedTechnique.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium transition hover:underline"
              style={{ color: pattern.color }}
            >
              Learn more about {pattern.name} Breathing →
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
