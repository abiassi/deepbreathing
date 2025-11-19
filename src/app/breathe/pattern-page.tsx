import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FadingHeroTitle } from "@/components/breathe/fading-hero-title";
import Resonance from "@/components/resonance/Resonance";
import { JsonLd } from "@/components/seo/json-ld";
import { breathingPageMap, type BreathingPageContent } from "@/data/breathing-pages";

const baseUrl = "https://deepbreathingexercises.com";

export function createPatternMetadata(slug: string): Metadata {
  const page = breathingPageMap[slug];
  if (!page) return {};

  const pageContent: BreathingPageContent = page;
  const canonicalUrl = `${baseUrl}/breathe/${pageContent.slug}`;
  const ogImageUrl = pageContent.meta.ogImage
    ? new URL(pageContent.meta.ogImage, baseUrl).toString()
    : new URL("/og-image.png", baseUrl).toString();

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
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          alt: `${pageContent.hero.title} – Interactive breathing visualizer`,
          width: 1200,
          height: 630
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: pageContent.meta.twitterTitle || pageContent.meta.title,
      description: pageContent.meta.twitterDescription || pageContent.meta.description,
      images: [ogImageUrl]
    }
  };
}

export function PatternPage({ slug }: { slug: string }) {
  const page = breathingPageMap[slug];
  if (!page) {
    notFound();
  }

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

  const heroHeader = (
    <FadingHeroTitle label="DEEP BREATHING EXERCISES" title={page.hero.title} subtitle={page.hero.subtitle} />
  );

  return (
    <main className="bg-transparent">
      <JsonLd data={[faqSchema]} />

      <section className="relative isolate min-h-screen w-full text-foreground">
        <Resonance defaultMode={page.mode} className="min-h-screen" />
        <div className="absolute inset-y-0 left-0 z-30 hidden w-full max-w-xl px-6 py-20 lg:flex lg:flex-col lg:justify-center">
          {heroHeader}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:hidden">{heroHeader}</div>
      </section>

      <section className="relative z-10 mx-auto mt-6 w-full max-w-6xl space-y-12 rounded-t-[48px] bg-background/95 px-4 pb-20 pt-16 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {page.benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[32px] bg-card p-6">
              <p className="text-sm uppercase tracking-widest text-primary">Benefit</p>
              <h2 className="mt-2 text-2xl font-semibold text-card-foreground">{benefit.title}</h2>
              <p className="mt-2 text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 rounded-[32px] bg-card p-8">
            <h2 className="text-2xl font-semibold text-card-foreground">Practice notes</h2>
            <p className="text-muted-foreground">Helpful reminders so the pattern stays gentle and sustainable.</p>
            <ul className="space-y-4">
              {page.practiceTips.map((tip) => (
                <li key={tip.title}>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground">{tip.title}</p>
                  <p className="text-base text-card-foreground">{tip.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div id="faq" className="space-y-4 rounded-[32px] bg-card p-8">
            <h2 className="text-2xl font-semibold text-card-foreground">FAQ</h2>
            <div className="space-y-3">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="rounded-2xl bg-muted p-4">
                  <summary className="cursor-pointer text-lg font-medium text-foreground">{faq.question}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
