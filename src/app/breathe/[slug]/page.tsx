import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FadingHeroTitle } from "@/components/breathe/fading-hero-title";
import Resonance from "@/components/resonance/Resonance";
import { JsonLd } from "@/components/seo/json-ld";
import { breathingPages, breathingPageMap, type BreathingPageContent } from "@/data/breathing-pages";

const baseUrl = "https://deepbreathingexercises.com";

type Params = { slug: string };

export function generateStaticParams() {
  return breathingPages.map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const page = breathingPageMap[params.slug];
  if (!page) return {};
  // TypeScript should narrow here, but we'll be explicit for Vercel's build
  const pageContent: BreathingPageContent = page;
  return {
    title: pageContent.meta.title,
    description: pageContent.meta.description,
    alternates: {
      canonical: `${baseUrl}/breathe/${pageContent.slug}`
    }
  };
}

export default function BreathePatternPage({ params }: { params: Params }) {
  const page = breathingPageMap[params.slug];
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

      <section className="relative z-10 mx-auto mt-6 w-full max-w-6xl space-y-12 rounded-t-[48px] bg-background/95 px-4 pb-20 pt-16 shadow-[0_-20px_80px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-border/60 bg-card/90 p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-primary">Breathing pattern</p>
          <h1 className="mt-3 text-3xl font-semibold text-card-foreground lg:text-4xl">{page.hero.title}</h1>
          <p className="mt-2 text-base text-muted-foreground">{page.hero.subtitle}</p>
          <p className="mt-4 text-base text-muted-foreground">{page.hero.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {page.benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[32px] border border-border/70 bg-card p-6">
              <p className="text-sm uppercase tracking-widest text-primary">Benefit</p>
              <h2 className="mt-2 text-2xl font-semibold text-card-foreground">{benefit.title}</h2>
              <p className="mt-2 text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 rounded-[32px] border border-border/70 bg-card p-8">
            <h2 className="text-2xl font-semibold text-card-foreground">Practice notes</h2>
            <ul className="space-y-4">
              {page.practiceTips.map((tip, index) => (
                <li key={tip.title} className="flex gap-4">
                  <span className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">{tip.title}</p>
                    <p className="text-base text-card-foreground">{tip.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div id="faq" className="space-y-4 rounded-[32px] border border-border/70 bg-card p-8">
            <h2 className="text-2xl font-semibold text-card-foreground">FAQ</h2>
            <div className="space-y-3">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl bg-muted p-4">
                  <summary className="flex items-center justify-between list-none text-lg font-medium text-foreground cursor-pointer">
                    <span>{faq.question}</span>
                    <span className="text-xs text-muted-foreground transition-transform duration-200 group-open:-rotate-180">⌄</span>
                  </summary>
                  <p className="mt-2 text-base text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
